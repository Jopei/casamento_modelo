import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface GuestGateModalProps {
  open: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (name: string, phone: string) => Promise<void>;
}

export function GuestGateModal({
  open,
  error,
  onClose,
  onSubmit,
}: GuestGateModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit(name, phone);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-brown/70 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-offwhite p-6 text-center shadow-2xl md:p-8"
          >
            <span className="font-script text-3xl text-gold">
              Quem esta ai?
            </span>
            <p className="mt-3 text-sm text-brown/70">
              Informe seu nome e telefone para confirmar presenca, curtir e
              comentar fotos, ou reservar um presente.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome completo"
                className="rounded-xl border border-brown/15 bg-white px-4 py-3 text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
              />
              <input
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Seu telefone"
                className="rounded-xl border border-brown/15 bg-white px-4 py-3 text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-wide text-offwhite transition-colors hover:bg-gold-light disabled:opacity-60"
              >
                {loading ? "Confirmando..." : "Continuar"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-brown/50 underline"
              >
                Agora nao
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
