import { api } from "../client";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export interface AdminLoginResponse {
  admin: AdminUser;
  token: string;
  /** ISO 8601. Depois disso o token deixa de ser aceito pela API. */
  expires_at: string;
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<AdminLoginResponse> {
  const { data } = await api.post<AdminLoginResponse>("/admin/login", {
    email,
    password,
  });
  return data;
}

export async function fetchAdminMe(): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>("/admin/me");
  return data;
}

export async function adminLogout(): Promise<void> {
  await api.post("/admin/logout");
}
