import { api } from "../client";
import type { Rsvp } from "../../types";

export async function fetchAdminRsvps(): Promise<Rsvp[]> {
  const { data } = await api.get<{ data: Rsvp[] }>("/admin/rsvps");
  return data.data;
}
