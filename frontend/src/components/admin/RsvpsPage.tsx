import { useEffect, useState } from "react";
import { fetchAdminRsvps } from "../../api/admin/rsvps";
import type { Rsvp } from "../../types";

export function RsvpsPage() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);

  useEffect(() => {
    fetchAdminRsvps().then(setRsvps);
  }, []);

  return (
    <div>
      <h1 className="font-script text-3xl text-gold md:text-4xl">Confirmacoes de Presenca</h1>

      {/* Cartoes no celular: a tabela esconderia a mensagem do convidado
          atras de rolagem lateral. */}
      <div className="mt-6 flex flex-col gap-3 lg:hidden">
        {rsvps.map((rsvp) => (
          <div key={rsvp.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-brown">{rsvp.guest.name}</p>
                <a
                  href={`tel:${rsvp.guest.phone}`}
                  className="text-sm text-brown/60 underline"
                >
                  {rsvp.guest.phone}
                </a>
              </div>
              <span className="shrink-0 rounded-full bg-gold/15 px-3 py-1 text-xs text-gold">
                {rsvp.companions_count > 0
                  ? `+${rsvp.companions_count}`
                  : "so"}
              </span>
            </div>
            {rsvp.message && (
              <p className="mt-3 border-t border-brown/10 pt-3 text-sm text-brown/70">
                {rsvp.message}
              </p>
            )}
          </div>
        ))}
        {rsvps.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-brown/50 shadow-sm">
            Nenhuma confirmacao ainda.
          </p>
        )}
      </div>

      <div className="mt-8 hidden overflow-hidden rounded-2xl bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-brown/5 text-brown/60">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Acompanhantes</th>
              <th className="px-4 py-3">Mensagem</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((rsvp) => (
              <tr key={rsvp.id} className="border-t border-brown/10">
                <td className="px-4 py-3 text-brown">{rsvp.guest.name}</td>
                <td className="px-4 py-3 text-brown/70">{rsvp.guest.phone}</td>
                <td className="px-4 py-3 text-brown/70">{rsvp.companions_count}</td>
                <td className="px-4 py-3 text-brown/70">{rsvp.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {rsvps.length === 0 && (
          <p className="p-6 text-center text-brown/50">Nenhuma confirmacao ainda.</p>
        )}
      </div>
    </div>
  );
}
