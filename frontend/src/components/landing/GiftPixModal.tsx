import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "qrcode";
import { copyText } from "../../lib/clipboard";
import { formatCurrency } from "../../lib/format";
import type { Gift, GiftReservationResult } from "../../types";

interface GiftPixModalProps {
  gift: Gift | null;
  reservation: GiftReservationResult | null;
  onClose: () => void;
  onCancelReservation: () => Promise<void>;
}

export function GiftPixModal({
  gift,
  reservation,
  onClose,
  onCancelReservation,
}: GiftPixModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [cancelling, setCancelling] = useState(false);

  const payload = reservation?.pix_payload ?? null;
  const open = Boolean(gift && reservation);

  useEffect(() => {
    if (!payload) {
      setQrDataUrl(null);
      return;
    }

    let active = true;

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1,
      color: { dark: "#6b5b45", light: "#fdfbf7" },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl(null);
      });

    return () => {
      active = false;
    };
  }, [payload]);

  useEffect(() => {
    if (!open) setCopyState("idle");
  }, [open]);

  const handleCopy = async () => {
    if (!payload) return;

    if (await copyText(payload)) {
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2500);
    } else {
      // Sem clipboard disponivel: o convidado ainda consegue selecionar
      // o codigo na tela, entao mostramos ele por inteiro.
      setCopyState("failed");
    }
  };

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
      {open && gift && reservation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-end justify-center bg-brown/70 px-0 sm:items-center sm:px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-t-3xl bg-offwhite p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center shadow-2xl sm:rounded-3xl sm:pb-6"
          >
            <span className="font-script text-3xl text-gold">Obrigado!</span>
            <p className="mt-2 text-sm text-brown/70">
              Voce escolheu <strong className="text-brown">{gift.name}</strong>
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold text-brown">
              {formatCurrency(reservation.amount)}
            </p>

            {payload ? (
              <>
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt="QR Code do PIX"
                    className="mx-auto mt-5 h-52 w-52 rounded-2xl bg-white p-2 shadow-sm"
                  />
                )}

                <p className="mt-5 text-sm text-brown/70">
                  Escaneie o QR Code no app do seu banco ou use o codigo abaixo.
                </p>

                {/* Quando a copia falha, o codigo aparece inteiro e
                    selecionavel para o convidado copiar na mao. */}
                <p
                  className={`mt-3 rounded-xl border border-brown/15 bg-white px-3 py-2 font-mono text-xs text-brown/60 ${
                    copyState === "failed"
                      ? "break-all select-all"
                      : "truncate"
                  }`}
                >
                  {payload}
                </p>

                <button
                  onClick={handleCopy}
                  className="mt-3 w-full rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-wide text-offwhite transition-colors hover:bg-gold-light"
                >
                  {copyState === "copied"
                    ? "Codigo copiado!"
                    : "Copiar codigo PIX"}
                </button>

                {copyState === "failed" && (
                  <p className="mt-2 text-xs text-brown/60">
                    Nao foi possivel copiar automaticamente. Toque e segure no
                    codigo acima para copiar.
                  </p>
                )}

                <p className="mt-4 text-xs text-brown/50">
                  Assim que recebermos, confirmamos o seu presente por aqui.
                </p>
              </>
            ) : (
              <p className="mt-6 rounded-2xl bg-champagne/60 px-4 py-4 text-sm text-brown/70">
                Seu presente ficou reservado, mas os noivos ainda nao cadastraram
                a chave PIX. Entre em contato com eles para combinar o pagamento.
              </p>
            )}

            <div className="mt-5 flex flex-col gap-2">
              <button
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
