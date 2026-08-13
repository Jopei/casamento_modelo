import { api } from "../client";
import type { AdminWeddingSettings } from "../../types";

export async function fetchAdminSettings(): Promise<AdminWeddingSettings> {
  const { data } = await api.get<{ data: AdminWeddingSettings }>(
    "/admin/settings",
  );
  return data.data;
}

export async function updateAdminSettings(
  payload: FormData,
): Promise<AdminWeddingSettings> {
  payload.append("_method", "PUT");
  const { data } = await api.post<{ data: AdminWeddingSettings }>(
    "/admin/settings",
    payload,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}
