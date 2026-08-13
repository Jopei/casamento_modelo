import { api } from "./client";
import type { WeddingSettings } from "../types";

export async function fetchSettings(): Promise<WeddingSettings> {
  const { data } = await api.get<{ data: WeddingSettings }>("/settings");
  return data.data;
}
