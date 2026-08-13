import { api } from "./client";
import type { Photo, PhotoComment } from "../types";

export async function fetchGallery(): Promise<Photo[]> {
  const { data } = await api.get<{ data: Photo[] }>("/gallery");
  return data.data;
}

export async function likePhoto(photoId: number): Promise<{ likes_count: number }> {
  const { data } = await api.post<{ likes_count: number }>(
    `/photos/${photoId}/like`,
  );
  return data;
}

export async function unlikePhoto(photoId: number): Promise<{ likes_count: number }> {
  const { data } = await api.delete<{ likes_count: number }>(
    `/photos/${photoId}/like`,
  );
  return data;
}

export async function commentOnPhoto(
  photoId: number,
  body: string,
): Promise<PhotoComment> {
  const { data } = await api.post<{ data: PhotoComment }>(
    `/photos/${photoId}/comments`,
    { body },
  );
  return data.data;
}

export async function downloadPhoto(photoId: number): Promise<void> {
  const response = await api.get(`/photos/${photoId}/download`, {
    responseType: "blob",
  });

  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `foto-${photoId}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
