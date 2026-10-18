import { useEffect, useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Gift } from "../../types";

interface GiftReserveModalProps {
  gift: Gift | null;
  onClose: () => void;
  onConfirm: (giverName: string | null, showName: boolean) => void;
}

/**
 * Primeiro passo ao presentear. O nome e opcional e so os noivos o veem;
 * a pergunta de surpresa so faz sentido quando ha um nome digitado.
 */
export function GiftReserveModal({
  gift,
  onClose,
  onConfirm,
}: GiftReserveModalProps) {
  const [name, setName] = useState("");
  const [showName, setShowName] = useState(false);
  const inputId = useId();
  const noteId = useId();

  useEffect(() => {
    if (gift) {
      setName("");
      setShowName(false);
    }
  }, [gift]);

  const trimmed = name.trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onConfirm(trimmed || null, trimmed ? showName : false);
  };

  const optionClass = (selected: boolean) =>
    `rounded-full px-6 py-3 text-sm transition-colors ${
      selected
        ? "bg-gold uppercase tracking-wide text-offwhite"
        : "border border-brown/20 text-brown/70 hover:bg-brown/5"
    }`;

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
            aria-label={`Reservar ${gift.name}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-t-3xl bg-offwhite p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center shadow-2xl sm:rounded-3xl sm:pb-6"
          >
            <span className="font-script text-3xl text-gold">
              Presentear com carinho
            </span>
            <p className="mt-2 text-sm text-brown/70">{gift.name}</p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <div className="text-left">
                <label
                  htmlFor={inputId}
                  className="text-sm font-medium text-brown"
                >
                  Seu nome (opcional)
                </label>
                <input
                  id={inputId}
                  autoFocus
                  type="text"
                  maxLength={80}
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-describedby={noteId}
                  className="mt-1 w-full rounded-2xl border border-brown/15 bg-white px-4 py-3 text-base text-brown focus:border-gold focus:outline-none"
                />
                <p id={noteId} className="mt-1 text-xs text-brown/50">
                  So os noivos vao ver
                </p>
              </div>

              {trimmed && (
                <fieldset className="mt-2 flex flex-col gap-3">
                  <legend className="mb-3 w-full font-script text-2xl text-gold">
                    Quer fazer surpresa de quem deu esse presente?
                  </legend>
                  <button
                    type="button"
                    aria-pressed={!showName}
                    onClick={() => setShowName(false)}
                    className={optionClass(!showName)}
                  >
                    Sim, quero fazer surpresa
                  </button>
                  <button
                    type="button"
                    aria-pressed={showName}
                    onClick={() => setShowName(true)}
                    className={optionClass(showName)}
                  >
                    Quero deixar no site que eu dei o presente
                  </button>
                </fieldset>
              )}

              <button
                type="submit"
                className="mt-2 rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-wide text-offwhite transition-colors hover:bg-gold-light"
              >
                Vou levar este presente
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
