import { api } from "../client";

export interface AdminPhoto {
  id: number;
  url: string;
  caption: string | null;
  order: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export async function fetchAdminPhotos(): Promise<AdminPhoto[]> {
  const { data } = await api.get<{ data: AdminPhoto[] }>("/admin/photos");
  return data.data;
}

export async function uploadPhoto(payload: FormData): Promise<AdminPhoto> {
  const { data } = await api.post<{ data: AdminPhoto }>(
    "/admin/photos",
    payload,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function deletePhoto(id: number): Promise<void> {
  await api.delete(`/admin/photos/${id}`);
}
