import { AnimatePresence, motion } from "framer-motion";
import type { Gift } from "../../types";

interface GiftSurpriseModalProps {
  gift: Gift | null;
  onClose: () => void;
  onChoose: (showName: boolean) => void;
}

/**
 * Primeiro passo ao presentear: o convidado escolhe se quer manter em
 * surpresa quem deu o presente ou deixar o nome no site.
 */
export function GiftSurpriseModal({
  gift,
  onClose,
  onChoose,
}: GiftSurpriseModalProps) {
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-t-3xl bg-offwhite p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center shadow-2xl sm:rounded-3xl sm:pb-6"
          >
            <span className="font-script text-3xl text-gold">
              Quer fazer surpresa de quem deu esse presente?
            </span>
            <p className="mt-2 text-sm text-brown/70">{gift.name}</p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onChoose(false)}
                className="rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-wide text-offwhite transition-colors hover:bg-gold-light"
              >
                Sim, quero fazer surpresa
              </button>
              <button
                type="button"
                onClick={() => onChoose(true)}
                className="rounded-full border border-brown/20 px-6 py-3 text-sm text-brown/70 transition-colors hover:bg-brown/5"
              >
                Quero deixar no site que eu dei o presente
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-brown/50 underline"
              >
                Agora nao
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
