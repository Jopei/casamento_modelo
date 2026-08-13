import { useEffect, useMemo, useState } from "react";
import {
  deleteGiftReservation,
  fetchAdminGiftReservations,
  updateGiftReservationStatus,
} from "../../api/admin/giftReservations";
import { formatCurrency } from "../../lib/format";
import type { GiftReservation } from "../../types";

export function GiftReservationsPage() {
  const [reservations, setReservations] = useState<GiftReservation[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = () => fetchAdminGiftReservations().then(setReservations);

  useEffect(() => {
    load();
  }, []);

  const totals = useMemo(() => {
    const sum = (status: GiftReservation["status"]) =>
      reservations
        .filter((reservation) => reservation.status === status)
        .reduce((total, reservation) => total + Number(reservation.amount), 0);

    return { paid: sum("paid"), pending: sum("pending") };
  }, [reservations]);

  const handleToggleStatus = async (reservation: GiftReservation) => {
    setBusyId(reservation.id);
    try {
      await updateGiftReservationStatus(
        reservation.id,
        reservation.status === "paid" ? "pending" : "paid",
      );
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const handleRelease = async (reservation: GiftReservation) => {
    const confirmed = window.confirm(
      `Liberar "${reservation.gift.name}" reservado por ${reservation.guest.name}? O presente volta para a lista.`,
    );
    if (!confirmed) return;

    setBusyId(reservation.id);
    try {
      await deleteGiftReservation(reservation.id);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="font-script text-3xl text-gold md:text-4xl">
        Reservas de Presentes
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-brown/60">Recebido (confirmado)</p>
          <p className="mt-1 text-2xl font-semibold text-brown">
            {formatCurrency(totals.paid)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-brown/60">Aguardando pagamento</p>
          <p className="mt-1 text-2xl font-semibold text-brown">
            {formatCurrency(totals.pending)}
          </p>
        </div>
      </div>

      {/* No celular a tabela viraria rolagem lateral e esconderia as acoes,
          entao cada reserva vira um cartao com tudo a vista. */}
      <div className="mt-6 flex flex-col gap-3 lg:hidden">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-brown">
                  {reservation.gift.name}
                </p>
                <p className="text-sm text-brown/70">
                  {reservation.guest.name}
                </p>
                <a
                  href={`tel:${reservation.guest.phone}`}
                  className="text-sm text-brown/60 underline"
                >
                  {reservation.guest.phone}
                </a>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                  reservation.status === "paid"
                    ? "bg-gold/15 text-gold"
                    : "bg-brown/10 text-brown/60"
                }`}
              >
                {reservation.status === "paid" ? "Pago" : "Pendente"}
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-lg font-semibold text-brown">
                {formatCurrency(reservation.amount)}
              </span>
              <span className="text-xs text-brown/50">
                {new Date(reservation.reserved_at).toLocaleDateString("pt-BR")}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleToggleStatus(reservation)}
                disabled={busyId === reservation.id}
                className="min-h-11 flex-1 rounded-full bg-gold px-4 text-sm text-offwhite disabled:opacity-50"
              >
                {reservation.status === "paid" ? "Desmarcar" : "Marcar pago"}
              </button>
              <button
                onClick={() => handleRelease(reservation)}
                disabled={busyId === reservation.id}
                className="min-h-11 rounded-full border border-red-200 px-4 text-sm text-red-600 disabled:opacity-50"
              >
                Liberar
              </button>
            </div>
          </div>
        ))}
        {reservations.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-brown/50 shadow-sm">
            Nenhuma reserva ainda.
          </p>
        )}
      </div>

      <div className="mt-6 hidden overflow-hidden rounded-2xl bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="bg-brown/5 text-brown/60">
              <tr>
                <th className="px-4 py-3">Presente</th>
                <th className="px-4 py-3">Convidado</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reservado em</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-t border-brown/10">
                  <td className="px-4 py-3 text-brown">
                    {reservation.gift.name}
                  </td>
                  <td className="px-4 py-3 text-brown/70">
                    {reservation.guest.name}
                  </td>
                  <td className="px-4 py-3 text-brown/70">
                    {reservation.guest.phone}
                  </td>
                  <td className="px-4 py-3 text-brown/70">
                    {formatCurrency(reservation.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        reservation.status === "paid"
                          ? "bg-gold/15 text-gold"
                          : "bg-brown/10 text-brown/60"
                      }`}
                    >
                      {reservation.status === "paid" ? "Pago" : "Pendente"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brown/70">
                    {new Date(reservation.reserved_at).toLocaleDateString(
                      "pt-BR",
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleToggleStatus(reservation)}
                        disabled={busyId === reservation.id}
                        className="text-brown/70 hover:underline disabled:opacity-50"
                      >
                        {reservation.status === "paid"
                          ? "Desmarcar"
                          : "Marcar pago"}
                      </button>
                      <button
                        onClick={() => handleRelease(reservation)}
                        disabled={busyId === reservation.id}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        Liberar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reservations.length === 0 && (
          <p className="p-6 text-center text-brown/50">Nenhuma reserva ainda.</p>
        )}
      </div>
    </div>
  );
}
