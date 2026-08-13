import { formatCurrency } from "../../lib/format";
import type { Gift } from "../../types";

interface GiftCardProps {
  gift: Gift;
  pending: boolean;
  onReserve: (gift: Gift) => void;
}

function GiftPlaceholder() {
  return (
    <div className="flex aspect-square w-full items-center justify-center bg-champagne">
      <svg
        viewBox="0 0 24 24"
        className="h-10 w-10 text-gold/60"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 11h17v9.5h-17z" />
        <path d="M2.5 7.5h19V11h-19z" />
        <path d="M12 7.5V20.5" />
        <path d="M12 7.5S10.5 3.5 8 3.5a2 2 0 0 0 0 4h4Z" />
        <path d="M12 7.5s1.5-4 4-4a2 2 0 0 1 0 4h-4Z" />
      </svg>
    </div>
  );
}

export function GiftCard({ gift, pending, onReserve }: GiftCardProps) {
  const disabled = pending || !gift.is_available;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-md">
      {gift.image_url ? (
        <img
          src={gift.image_url}
          alt={gift.name}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      ) : (
        <GiftPlaceholder />
      )}

      <div className="flex flex-1 flex-col p-4 text-center sm:p-5">
        <h3 className="line-clamp-2 min-h-[2.75rem] font-serif text-base font-semibold text-brown sm:text-lg">
          {gift.name}
        </h3>

        {/* Caixa de 2 linhas com altura fixa: e o que mantem todos os
            cards com a mesma altura, com ou sem descricao. */}
        <p className="mt-1 line-clamp-2 h-8 overflow-hidden text-xs leading-4 text-brown/60 sm:h-10 sm:text-sm sm:leading-5">
          {gift.description}
        </p>

        <p className="mt-3 font-serif text-lg font-semibold text-brown">
          {gift.is_free_amount ? "Valor livre" : formatCurrency(gift.price)}
        </p>

        {/* Espaco reservado mesmo sem texto, para os cards nao desalinharem. */}
        <p className="mt-1 min-h-[1.25rem] text-xs text-brown/50">
          {gift.is_free_amount
            ? "Voce escolhe quanto"
            : gift.quantity > 1
              ? `Restam ${gift.available_count} de ${gift.quantity}`
              : ""}
        </p>

        <div className="mt-auto pt-4">
          <button
            onClick={() => onReserve(gift)}
            disabled={disabled}
            className={`w-full rounded-full px-4 py-2.5 text-xs uppercase tracking-wide transition-colors sm:text-sm ${
              gift.is_available
                ? "bg-gold text-offwhite hover:bg-gold-light disabled:opacity-50"
                : "cursor-not-allowed bg-brown/10 text-brown/40"
            }`}
          >
            {!gift.is_available
              ? "Ja presenteado"
              : pending
                ? "Aguarde..."
                : "Presentear"}
          </button>
        </div>
      </div>
    </div>
  );
}
