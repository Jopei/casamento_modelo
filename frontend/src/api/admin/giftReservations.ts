import { api } from "../client";
import type { GiftReservation, ReservationStatus } from "../../types";

export async function fetchAdminGiftReservations(): Promise<GiftReservation[]> {
  const { data } = await api.get<{ data: GiftReservation[] }>(
    "/admin/gift-reservations",
  );
  return data.data;
}

export async function updateGiftReservationStatus(
  id: number,
  status: ReservationStatus,
): Promise<GiftReservation> {
  const { data } = await api.patch<{ data: GiftReservation }>(
    `/admin/gift-reservations/${id}`,
    { status },
  );
  return data.data;
}

/** Devolve a unidade para a lista publica. */
export async function deleteGiftReservation(id: number): Promise<void> {
  await api.delete(`/admin/gift-reservations/${id}`);
}
