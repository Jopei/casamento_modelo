import { api } from "../client";
import type { ScheduleItem } from "../../types";

export async function fetchAdminScheduleItems(): Promise<ScheduleItem[]> {
  const { data } = await api.get<{ data: ScheduleItem[] }>(
    "/admin/schedule-items",
  );
  return data.data;
}

export async function createScheduleItem(
  payload: Omit<ScheduleItem, "id">,
): Promise<ScheduleItem> {
  const { data } = await api.post<{ data: ScheduleItem }>(
    "/admin/schedule-items",
    payload,
  );
  return data.data;
}

export async function updateScheduleItem(
  id: number,
  payload: Omit<ScheduleItem, "id">,
): Promise<ScheduleItem> {
  const { data } = await api.put<{ data: ScheduleItem }>(
    `/admin/schedule-items/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteScheduleItem(id: number): Promise<void> {
  await api.delete(`/admin/schedule-items/${id}`);
}
