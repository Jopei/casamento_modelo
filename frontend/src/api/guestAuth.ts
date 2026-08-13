import { api } from "./client";
import type { Guest, GiftReservation, Rsvp } from "../types";

export interface IdentifyResponse {
  guest: Guest;
  token: string;
}

export async function identifyGuest(
  name: string,
  phone: string,
): Promise<IdentifyResponse> {
  const { data } = await api.post<IdentifyResponse>("/guest/identify", {
    name,
    phone,
  });
  return data;
}

export interface GuestMeResponse {
  guest: Guest;
  rsvp: Rsvp | null;
  gift_reservation: GiftReservation | null;
}

export async function fetchGuestMe(): Promise<GuestMeResponse> {
  const { data } = await api.get<GuestMeResponse>("/guest/me");
  return data;
}
