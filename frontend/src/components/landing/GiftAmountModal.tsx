import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Gift } from "../../types";

interface GiftAmountModalProps {
  gift: Gift | null;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

/**
 * Passo extra so para o presente de valor livre. Fica fora do card para
 * que todos os cards da lista tenham exatamente a mesma altura.
 */
export function GiftAmountModal({
  gift,
  onClose,
  onConfirm,
}: GiftAmountModalProps) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (gift) setAmount("");
  }, [gift]);

  const parsed = Number(amount.replace(",", "."));
  const isValid = Number.isFinite(parsed) && parsed >= 1;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isValid) onConfirm(parsed);
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-t-3xl bg-offwhite p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center shadow-2xl sm:rounded-3xl sm:pb-6"
          >
            <span className="font-script text-3xl text-gold">
              Quanto voce quer presentear?
            </span>
            <p className="mt-2 text-sm text-brown/70">{gift.name}</p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <label className="flex items-center gap-2 rounded-2xl border border-brown/15 bg-white px-4 py-3 text-left">
                <span className="text-brown/60">R$</span>
                <input
                  autoFocus
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0,00"
                  aria-label="Valor do presente"
                  className="w-full min-w-0 bg-transparent text-base text-brown placeholder:text-brown/30 focus:outline-none"
                />
              </label>

              <p className="min-h-[1rem] text-xs text-brown/50">
                {amount && !isValid ? "O valor minimo e de R$ 1,00." : ""}
              </p>

              <button
                type="submit"
                disabled={!isValid}
                className="rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-wide text-offwhite transition-colors hover:bg-gold-light disabled:opacity-50"
              >
                Continuar
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
