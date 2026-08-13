import { api } from "../client";
import type { StoryItem } from "../../types";

export async function fetchAdminStoryItems(): Promise<StoryItem[]> {
  const { data } = await api.get<{ data: StoryItem[] }>("/admin/story-items");
  return data.data;
}

export async function createStoryItem(payload: FormData): Promise<StoryItem> {
  const { data } = await api.post<{ data: StoryItem }>(
    "/admin/story-items",
    payload,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function updateStoryItem(
  id: number,
  payload: FormData,
): Promise<StoryItem> {
  payload.append("_method", "PUT");
  const { data } = await api.post<{ data: StoryItem }>(
    `/admin/story-items/${id}`,
    payload,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function deleteStoryItem(id: number): Promise<void> {
  await api.delete(`/admin/story-items/${id}`);
}
