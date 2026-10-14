import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { GiftList } from "../components/landing/GiftList";
import { GiftAmountModal } from "../components/landing/GiftAmountModal";
import { GiftReserveModal } from "../components/landing/GiftReserveModal";
import { GiftReservedModal } from "../components/landing/GiftReservedModal";
import { GiftPixModal } from "../components/landing/GiftPixModal";
import { cancelReservation, fetchGifts, reserveGift } from "../api/gifts";
import type { Gift, GiftReservationResult } from "../types";

export function GiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [pendingGiftId, setPendingGiftId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [askingReserveFor, setAskingReserveFor] = useState<Gift | null>(
    null,
  );
  const [askingAmountFor, setAskingAmountFor] = useState<{
    gift: Gift;
    giverName: string | null;
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
    giverName: string | null,
    showName: boolean,
    amount?: number,
  ) => {
    setError(null);
    setPendingGiftId(gift.id);

    try {
      const { gift: updated, reservation } = await reserveGift(gift.id, {
        giverName,
        showName,
        amount,
      });

      setGifts((current) =>
        current.map((item) => (item.id === gift.id ? updated : item)),
      );
      setSelected({ gift: updated, reservation });
    } catch (requestError) {
      setError(
        axios.isAxiosError(requestError) &&
          requestError.response?.status === 429
          ? "Muitas tentativas. Aguarde um minuto e tente de novo."
          : ((axios.isAxiosError(requestError) &&
              requestError.response?.data?.message) ||
              "Nao foi possivel reservar este presente. Tente novamente."),
      );
      // O presente pode ter esgotado com a pagina aberta.
      await load();
    } finally {
      setPendingGiftId(null);
    }
  };

  const handleReserveGift = (gift: Gift) => {
    if (!gift.is_available) return;

    setAskingReserveFor(gift);
  };

  const handleConfirmReserve = (giverName: string | null, showName: boolean) => {
    const gift = askingReserveFor;
    setAskingReserveFor(null);
    if (!gift) return;

    if (gift.is_free_amount) {
      setAskingAmountFor({ gift, giverName, showName });
      return;
    }

    reserve(gift, giverName, showName);
  };

  const handleConfirmAmount = (amount: number) => {
    const asking = askingAmountFor;
    setAskingAmountFor(null);
    if (asking) reserve(asking.gift, asking.giverName, asking.showName, amount);
  };

  const handleCancelReservation = async () => {
    if (!selected) return;

    try {
      await cancelReservation(
        selected.reservation.id,
        selected.reservation.cancel_token,
      );
      setSelected(null);
    } catch (requestError) {
      setSelected(null);
      setError(
        axios.isAxiosError(requestError) &&
          requestError.response?.data?.message
          ? requestError.response.data.message
          : "Nao foi possivel cancelar a reserva. Tente novamente.",
      );
    }
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
      <GiftReserveModal
        gift={askingReserveFor}
        onClose={() => setAskingReserveFor(null)}
        onConfirm={handleConfirmReserve}
      />
      <GiftAmountModal
        gift={askingAmountFor?.gift ?? null}
        onClose={() => setAskingAmountFor(null)}
        onConfirm={handleConfirmAmount}
      />
      <GiftReservedModal
        gift={selected && !selected.gift.is_free_amount ? selected.gift : null}
        onClose={() => setSelected(null)}
        onCancelReservation={handleCancelReservation}
      />
      <GiftPixModal
        gift={selected?.gift.is_free_amount ? selected.gift : null}
        reservation={selected?.reservation ?? null}
        onClose={() => setSelected(null)}
        onCancelReservation={handleCancelReservation}
      />
    </>
  );
}
