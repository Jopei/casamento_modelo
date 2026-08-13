import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getAdminTokenExpiry,
  setAdminToken,
  setAdminUnauthorizedHandler,
} from "../api/client";
import { adminLogin, adminLogout, fetchAdminMe, type AdminUser } from "../api/admin/auth";

interface AdminAuthContextValue {
  admin: AdminUser | null;
  ready: boolean;
  /** Verdadeiro quando a sessao caiu sozinha, por tempo esgotado. */
  expired: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const endSession = useCallback((wasExpired: boolean) => {
    clearTimer();
    setAdminToken(null);
    setAdmin(null);
    setExpired(wasExpired);
  }, []);

  /**
   * Agenda a saida para o instante exato em que o token vence, para o admin
   * nao descobrir que caiu so ao clicar em algo e receber erro.
   */
  const scheduleExpiry = useCallback(() => {
    clearTimer();

    const expiresAt = getAdminTokenExpiry();
    if (!expiresAt) return;

    const remaining = expiresAt - Date.now();

    if (remaining <= 0) {
      endSession(true);
      return;
    }

    // setTimeout satura acima de ~24,8 dias; a sessao e de horas, mas o
    // limite evita disparo imediato se a data vier absurda.
    timerRef.current = setTimeout(
      () => endSession(true),
      Math.min(remaining, 2_147_483_647),
    );
  }, [endSession]);

  // O interceptor avisa quando a API recusa o token (vencido ou revogado).
  useEffect(() => {
    setAdminUnauthorizedHandler(() => {
      clearTimer();
      setAdmin(null);
      setExpired(true);
    });

    return () => setAdminUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setReady(true);
      return;
    }

    // Ja venceu enquanto a aba estava fechada: nem chega a consultar a API.
    const expiresAt = getAdminTokenExpiry();
    if (expiresAt !== null && expiresAt <= Date.now()) {
      endSession(true);
      setReady(true);
      return;
    }

    fetchAdminMe()
      .then((user) => {
        setAdmin(user);
        scheduleExpiry();
      })
      .catch(() => setAdminToken(null))
      .finally(() => setReady(true));

    return clearTimer;
  }, [endSession, scheduleExpiry]);

  const login = async (email: string, password: string) => {
    const response = await adminLogin(email, password);

    setAdminToken(response.token, response.expires_at);
    setAdmin(response.admin);
    setExpired(false);
    scheduleExpiry();
  };

  const logout = () => {
    adminLogout().catch(() => undefined);
    endSession(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, ready, expired, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
