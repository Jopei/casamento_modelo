import { api } from "./client";
import type { StoryItem } from "../types";

export async function fetchStory(): Promise<StoryItem[]> {
  const { data } = await api.get<{ data: StoryItem[] }>("/story");
  return data.data;
}
