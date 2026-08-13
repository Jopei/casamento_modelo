import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import type { WeddingSettings } from "../../types";

const LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/historia", label: "Historia" },
  { to: "/local", label: "Local" },
  { to: "/cronograma", label: "Cronograma" },
  { to: "/dress-code", label: "Dress Code" },
  { to: "/presentes", label: "Presentes" },
  { to: "/rsvp", label: "RSVP" },
];

/** Abaixo disso o header sempre aparece, para nao piscar no topo da pagina. */
const HIDE_AFTER = 80;

interface NavbarProps {
  /** Ausente enquanto as configuracoes ainda estao carregando. */
  settings?: WeddingSettings | null;
}

/**
 * Monograma no estilo tradicional de casamento: inicial da noiva, o
 * ampersand, inicial do noivo. Sai das configuracoes para nao envelhecer
 * quando os nomes mudarem.
 */
function monogram(settings?: WeddingSettings | null): string | null {
  const bride = settings?.bride_name?.trim()?.[0];
  const groom = settings?.groom_name?.trim()?.[0];

  if (!bride || !groom) return null;

  return `${bride.toUpperCase()} & ${groom.toUpperCase()}`;
}

export function Navbar({ settings }: NavbarProps) {
  const initials = monogram(settings);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;

      setScrolled(current > 40);
      setHidden(current > HIDE_AFTER && current > lastScrollY.current);

      lastScrollY.current = current;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-base tracking-wide transition-colors hover:text-gold ${
      isActive ? "text-gold" : "text-brown/80"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-offwhite/90 py-4 shadow-sm backdrop-blur-sm md:py-5"
          : "bg-transparent py-6 md:py-9"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8">
        <NavLink
          to="/"
          className={`font-script text-brown transition-all duration-500 ${
            scrolled ? "text-2xl" : "text-3xl"
          }`}
        >
          {initials}
        </NavLink>
        <ul className="hidden gap-8 lg:flex">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClass} end={link.to === "/"}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
