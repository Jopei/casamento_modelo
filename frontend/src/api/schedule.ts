import { api } from "./client";
import type { ScheduleItem } from "../types";

export async function fetchSchedule(): Promise<ScheduleItem[]> {
  const { data } = await api.get<{ data: ScheduleItem[] }>("/schedule");
  return data.data;
}
