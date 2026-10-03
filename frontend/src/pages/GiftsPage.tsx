import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { GiftList } from "../components/landing/GiftList";
import { GiftAmountModal } from "../components/landing/GiftAmountModal";
import { GiftSurpriseModal } from "../components/landing/GiftSurpriseModal";
import { GiftPixModal } from "../components/landing/GiftPixModal";
import { fetchGifts, releaseGift, reserveGift } from "../api/gifts";
import { useGuestAuth } from "../context/GuestAuthContext";
import type { Gift, GiftReservationResult } from "../types";

export function GiftsPage() {
  const { ensureIdentified } = useGuestAuth();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [pendingGiftId, setPendingGiftId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [askingSurpriseFor, setAskingSurpriseFor] = useState<Gift | null>(
    null,
  );
  const [askingAmountFor, setAskingAmountFor] = useState<{
    gift: Gift;
    showName: boolean;
  } | null>(null);
  const [selected, setSelected] = useState<{
    gift: Gift;
    reservation: GiftReservationResult;
  } | null>(null);

  const load = useCallback(() => fetchGifts().then(setGifts), []);

  useEffect(() => {
    load();
  }, [load]);

  const reserve = async (
    gift: Gift,
    showName: boolean,
    amount?: number,
  ) => {
    setError(null);

    try {
      await ensureIdentified();
    } catch {
      // Convidado fechou o modal de identificacao sem se identificar.
      return;
    }

    setPendingGiftId(gift.id);

    try {
      const { gift: updated, reservation } = await reserveGift(gift.id, {
        amount,
        showName,
      });

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

    setAskingSurpriseFor(gift);
  };

  const handleChooseSurprise = (showName: boolean) => {
    const gift = askingSurpriseFor;
    setAskingSurpriseFor(null);
    if (!gift) return;

    if (gift.is_free_amount) {
      setAskingAmountFor({ gift, showName });
      return;
    }

    reserve(gift, showName);
  };

  const handleConfirmAmount = (amount: number) => {
    const asking = askingAmountFor;
    setAskingAmountFor(null);
    if (asking) reserve(asking.gift, asking.showName, amount);
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
      <GiftSurpriseModal
        gift={askingSurpriseFor}
        onClose={() => setAskingSurpriseFor(null)}
        onChoose={handleChooseSurprise}
      />
      <GiftAmountModal
        gift={askingAmountFor?.gift ?? null}
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
