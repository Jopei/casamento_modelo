import { api } from "../client";
import type { ReservationStatus } from "../../types";

export interface AdminGiftReservation {
  id: number;
  guest_name: string;
  guest_phone: string;
  amount: string;
  status: ReservationStatus;
  reserved_at: string;
  paid_at: string | null;
}

export interface AdminGift {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  price: string | null;
  quantity: number;
  is_free_amount: boolean;
  reserved_count: number;
  available_count: number;
  is_available: boolean;
  reservations: AdminGiftReservation[];
}

export async function fetchAdminGifts(): Promise<AdminGift[]> {
  const { data } = await api.get<{ data: AdminGift[] }>("/admin/gifts");
  return data.data;
}

export async function createGift(payload: FormData): Promise<AdminGift> {
  const { data } = await api.post<{ data: AdminGift }>(
    "/admin/gifts",
    payload,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function updateGift(
  id: number,
  payload: FormData,
): Promise<AdminGift> {
  // Laravel nao le multipart em PUT, entao o metodo vai no corpo.
  payload.append("_method", "PUT");
  const { data } = await api.post<{ data: AdminGift }>(
    `/admin/gifts/${id}`,
    payload,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function deleteGift(id: number): Promise<void> {
  await api.delete(`/admin/gifts/${id}`);
}
