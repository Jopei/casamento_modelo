import { api } from "./client";
import type { Gift, GiftReservationResult } from "../types";

export interface ReserveGiftResponse {
  gift: Gift;
  reservation: GiftReservationResult;
}

export async function fetchGifts(): Promise<Gift[]> {
  const { data } = await api.get<{ data: Gift[] }>("/gifts");
  return data.data;
}

export async function reserveGift(
  giftId: number,
  {
    giverName,
    showName,
    amount,
  }: { giverName: string | null; showName: boolean; amount?: number },
): Promise<ReserveGiftResponse> {
  const { data } = await api.post<ReserveGiftResponse>(
    `/gifts/${giftId}/reserve`,
    {
      giver_name: giverName,
      show_name: showName,
      ...(amount === undefined ? {} : { amount }),
    },
  );
  return data;
}

export async function cancelReservation(
  reservationId: number,
  cancelToken: string,
): Promise<void> {
  await api.post(`/gift-reservations/${reservationId}/cancel`, {
    cancel_token: cancelToken,
  });
}
