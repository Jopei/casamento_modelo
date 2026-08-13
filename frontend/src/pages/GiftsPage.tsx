import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { GiftList } from "../components/landing/GiftList";
import { GiftAmountModal } from "../components/landing/GiftAmountModal";
import { GiftPixModal } from "../components/landing/GiftPixModal";
import { fetchGifts, releaseGift, reserveGift } from "../api/gifts";
import { useGuestAuth } from "../context/GuestAuthContext";
import type { Gift, GiftReservationResult } from "../types";

export function GiftsPage() {
  const { ensureIdentified } = useGuestAuth();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [pendingGiftId, setPendingGiftId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [askingAmountFor, setAskingAmountFor] = useState<Gift | null>(null);
  const [selected, setSelected] = useState<{
    gift: Gift;
    reservation: GiftReservationResult;
  } | null>(null);

  const load = useCallback(() => fetchGifts().then(setGifts), []);

  useEffect(() => {
    load();
  }, [load]);

  const reserve = async (gift: Gift, amount?: number) => {
    setError(null);

    try {
      await ensureIdentified();
    } catch {
      // Convidado fechou o modal de identificacao sem se identificar.
      return;
    }

    setPendingGiftId(gift.id);

    try {
      const { gift: updated, reservation } = await reserveGift(gift.id, amount);

      setGifts((current) =>
        current.map((item) => (item.id === gift.id ? updated : item)),
      );
      setSelected({ gift: updated, reservation });
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(
          requestError.response?.data?.message ??
            "Nao foi possivel reservar este presente. Tente novamente.",
        );
        // O presente pode ter esgotado com a pagina aberta.
        await load();
      }
    } finally {
      setPendingGiftId(null);
    }
  };

  const handleReserveGift = (gift: Gift) => {
    if (!gift.is_available) return;

    if (gift.is_free_amount) {
      setAskingAmountFor(gift);
      return;
    }

    reserve(gift);
  };

  const handleConfirmAmount = (amount: number) => {
    const gift = askingAmountFor;
    setAskingAmountFor(null);
    if (gift) reserve(gift, amount);
  };

  const handleCancelReservation = async () => {
    if (!selected) return;

    await releaseGift(selected.gift.id);
    setSelected(null);
    await load();
  };

  return (
    <>
      <GiftList
        gifts={gifts}
        error={error}
        pendingGiftId={pendingGiftId}
        onReserve={handleReserveGift}
      />
      <GiftAmountModal
        gift={askingAmountFor}
        onClose={() => setAskingAmountFor(null)}
        onConfirm={handleConfirmAmount}
      />
      <GiftPixModal
        gift={selected?.gift ?? null}
        reservation={selected?.reservation ?? null}
        onClose={() => setSelected(null)}
        onCancelReservation={handleCancelReservation}
      />
    </>
  );
}
