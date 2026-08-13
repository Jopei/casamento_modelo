import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/settings", label: "Configuracoes" },
  { to: "/admin/story", label: "Historia" },
  { to: "/admin/schedule", label: "Cronograma" },
  { to: "/admin/photos", label: "Fotos" },
  { to: "/admin/gifts", label: "Presentes" },
  { to: "/admin/rsvps", label: "RSVPs" },
  { to: "/admin/gift-reservations", label: "Reservas" },
];

export function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-offwhite">
      {menuOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-brown/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-brown/10 bg-white px-4 py-8 transition-transform duration-300 lg:static lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <span className="px-2 font-script text-3xl text-gold">Admin</span>
        <nav className="mt-8 flex flex-col gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-gold/10 text-gold"
                    : "text-brown/70 hover:bg-brown/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <p className="px-2 text-xs text-brown/50">{admin?.email}</p>
          <button
            onClick={logout}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-brown/70 hover:bg-brown/5"
          >
            Sair
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-brown/10 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span className="h-0.5 w-6 bg-brown" />
            <span className="h-0.5 w-6 bg-brown" />
            <span className="h-0.5 w-6 bg-brown" />
          </button>
          <span className="font-script text-2xl text-gold">Admin</span>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
