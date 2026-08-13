import axios from "axios";

/**
 * Sem VITE_API_URL definido, a API e procurada no mesmo host que serviu o
 * site, na porta 8090. E o que faz o site funcionar ao ser aberto pelo IP
 * da rede local (celular): fixar "localhost" apontaria para o proprio
 * aparelho, e nenhuma chamada completaria.
 */
function resolveBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL;
  if (configured) return configured;

  const { protocol, hostname } = window.location;

  return `${protocol}//${hostname}:8090/api`;
}

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: { Accept: "application/json" },
});

let guestToken: string | null = localStorage.getItem("guest_token");
let adminToken: string | null = localStorage.getItem("admin_token");

export function setGuestToken(token: string | null) {
  guestToken = token;
  if (token) localStorage.setItem("guest_token", token);
  else localStorage.removeItem("guest_token");
}

const ADMIN_EXPIRY_KEY = "admin_token_expires_at";

export function setAdminToken(token: string | null, expiresAt?: string | null) {
  adminToken = token;

  if (token) {
    localStorage.setItem("admin_token", token);
    if (expiresAt) localStorage.setItem(ADMIN_EXPIRY_KEY, expiresAt);
  } else {
    localStorage.removeItem("admin_token");
    localStorage.removeItem(ADMIN_EXPIRY_KEY);
  }
}

/** Quando a sessao do painel vence, em ms desde a epoca. */
export function getAdminTokenExpiry(): number | null {
  const stored = localStorage.getItem(ADMIN_EXPIRY_KEY);
  if (!stored) return null;

  const at = Date.parse(stored);

  return Number.isNaN(at) ? null : at;
}

let onAdminUnauthorized: (() => void) | null = null;

export function setAdminUnauthorizedHandler(handler: (() => void) | null) {
  onAdminUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  const isAdminRequest = config.url?.startsWith("/admin");
  const token = isAdminRequest ? adminToken : guestToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Token do painel vencido (ou revogado no servidor) derruba a sessao na
 * hora, em vez de deixar as telas do admin falhando uma a uma.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const isAdminRequest = url.startsWith("/admin") && url !== "/admin/login";

    if (error.response?.status === 401 && isAdminRequest) {
      setAdminToken(null);
      onAdminUnauthorized?.();
    }

    return Promise.reject(error);
  },
);
