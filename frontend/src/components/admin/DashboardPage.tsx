import { useEffect, useState } from "react";
import { fetchAdminRsvps } from "../../api/admin/rsvps";
import { fetchAdminGifts } from "../../api/admin/gifts";
import { fetchAdminPhotos } from "../../api/admin/photos";
import { formatCurrency } from "../../lib/format";

export function DashboardPage() {
  const [stats, setStats] = useState({
    confirmedGuests: 0,
    totalCompanions: 0,
    reservedUnits: 0,
    totalUnits: 0,
    paidAmount: 0,
    pendingAmount: 0,
    totalPhotos: 0,
  });

  useEffect(() => {
    Promise.all([fetchAdminRsvps(), fetchAdminGifts(), fetchAdminPhotos()]).then(
      ([rsvps, gifts, photos]) => {
        const reservations = gifts.flatMap((gift) => gift.reservations);
        const sum = (status: "paid" | "pending") =>
          reservations
            .filter((reservation) => reservation.status === status)
            .reduce((total, reservation) => total + Number(reservation.amount), 0);

        setStats({
          confirmedGuests: rsvps.filter((rsvp) => rsvp.attending).length,
          totalCompanions: rsvps.reduce(
            (sum, rsvp) => sum + rsvp.companions_count,
            0,
          ),
          // Presentes de valor livre nao tem estoque, entao ficam de fora.
          reservedUnits: gifts
            .filter((gift) => !gift.is_free_amount)
            .reduce((total, gift) => total + gift.reserved_count, 0),
          totalUnits: gifts
            .filter((gift) => !gift.is_free_amount)
            .reduce((total, gift) => total + gift.quantity, 0),
          paidAmount: sum("paid"),
          pendingAmount: sum("pending"),
          totalPhotos: photos.length,
        });
      },
    );
  }, []);

  const cards = [
    { label: "Convidados confirmados", value: stats.confirmedGuests },
    { label: "Acompanhantes", value: stats.totalCompanions },
    {
      label: "Presentes escolhidos",
      value: `${stats.reservedUnits}/${stats.totalUnits}`,
    },
    { label: "Fotos na galeria", value: stats.totalPhotos },
    { label: "Recebido (confirmado)", value: formatCurrency(stats.paidAmount) },
    {
      label: "Aguardando pagamento",
      value: formatCurrency(stats.pendingAmount),
    },
  ];

  return (
    <div>
      <h1 className="font-script text-3xl text-gold md:text-4xl">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:mt-8 md:gap-6 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
            <p className="text-xs text-brown/60 md:text-sm">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-brown md:text-3xl">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
