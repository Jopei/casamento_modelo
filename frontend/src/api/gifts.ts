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
  amount?: number,
): Promise<ReserveGiftResponse> {
  const { data } = await api.post<ReserveGiftResponse>(
    `/gifts/${giftId}/reserve`,
    amount === undefined ? {} : { amount },
  );
  return data;
}

export async function releaseGift(giftId: number): Promise<void> {
  await api.delete(`/gifts/${giftId}/reserve`);
}
