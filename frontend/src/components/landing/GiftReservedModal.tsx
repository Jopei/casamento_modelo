import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Gift } from "../../types";

interface GiftReservedModalProps {
  gift: Gift | null;
  onClose: () => void;
  onCancelReservation: () => Promise<void>;
}

/** Confirmacao do presente com preco: reservado, sem pagamento. */
export function GiftReservedModal({
  gift,
  onClose,
  onCancelReservation,
}: GiftReservedModalProps) {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancelReservation();
    } finally {
      setCancelling(false);
    }
  };

  return (
    <AnimatePresence>
      {gift && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-end justify-center bg-brown/70 sm:items-center sm:px-4"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Presente reservado"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-t-3xl bg-offwhite p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center shadow-2xl sm:rounded-3xl sm:pb-6"
          >
            <span className="font-script text-3xl text-gold">Obrigado!</span>
            <p className="mt-2 text-sm text-brown/70">Presente reservado</p>
            <p className="mt-1 font-serif text-xl font-semibold text-brown">
              {gift.name}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                autoFocus
                onClick={onClose}
                className="rounded-full border border-brown/15 px-6 py-3 text-sm uppercase tracking-wide text-brown/70 transition-colors hover:bg-brown/5"
              >
                Fechar
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-sm text-brown/50 underline disabled:opacity-60"
              >
                {cancelling ? "Cancelando..." : "Cancelar reserva"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
