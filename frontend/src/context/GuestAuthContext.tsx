import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { setGuestToken } from "../api/client";
import { fetchGuestMe, identifyGuest } from "../api/guestAuth";
import { GuestGateModal } from "../components/layout/GuestGateModal";
import type { Guest } from "../types";

interface GuestAuthContextValue {
  guest: Guest | null;
  ready: boolean;
  ensureIdentified: () => Promise<Guest>;
  logout: () => void;
}

const GuestAuthContext = createContext<GuestAuthContextValue | null>(null);

export function GuestAuthProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [ready, setReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const pendingRef = useRef<{
    resolve: (guest: Guest) => void;
    reject: (reason: Error) => void;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("guest_token");
    if (!token) {
      setReady(true);
      return;
    }

    fetchGuestMe()
      .then((response) => setGuest(response.guest))
      .catch(() => setGuestToken(null))
      .finally(() => setReady(true));
  }, []);

  const ensureIdentified = useCallback((): Promise<Guest> => {
    if (guest) return Promise.resolve(guest);

    setModalError(null);
    setModalOpen(true);

    return new Promise((resolve, reject) => {
      pendingRef.current = { resolve, reject };
    });
  }, [guest]);

  const handleModalSubmit = async (name: string, phone: string) => {
    try {
      const response = await identifyGuest(name, phone);
      setGuestToken(response.token);
      setGuest(response.guest);
      setModalOpen(false);
      pendingRef.current?.resolve(response.guest);
      pendingRef.current = null;
    } catch {
      setModalError("Nao foi possivel confirmar seus dados. Tente novamente.");
    }
  };

  /**
   * Sem isso a promise de ensureIdentified ficaria pendurada para sempre
   * quando o convidado fecha o modal sem se identificar.
   */
  const handleModalClose = () => {
    setModalOpen(false);
    pendingRef.current?.reject(new Error("guest-identification-cancelled"));
    pendingRef.current = null;
  };

  const logout = () => {
    setGuestToken(null);
    setGuest(null);
  };

  return (
    <GuestAuthContext.Provider value={{ guest, ready, ensureIdentified, logout }}>
      {children}
      <GuestGateModal
        open={modalOpen}
        error={modalError}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </GuestAuthContext.Provider>
  );
}

export function useGuestAuth(): GuestAuthContextValue {
  const context = useContext(GuestAuthContext);
  if (!context) {
    throw new Error("useGuestAuth must be used within a GuestAuthProvider");
  }
  return context;
}
