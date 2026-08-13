import { api } from "./client";
import type { Rsvp } from "../types";

export interface RsvpPayload {
  attending: boolean;
  companions_count: number;
  message?: string;
}

export async function submitRsvp(payload: RsvpPayload): Promise<Rsvp> {
  const { data } = await api.post<{ data: Rsvp }>("/rsvp", payload);
  return data.data;
}
