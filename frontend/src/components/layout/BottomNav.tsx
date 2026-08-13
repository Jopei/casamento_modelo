import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const MORE_LINKS = [
  { to: "/historia", label: "Nossa Historia" },
  { to: "/local", label: "Local" },
  { to: "/cronograma", label: "Cronograma" },
  { to: "/dress-code", label: "Dress Code" },
];

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...iconProps}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...iconProps}>
      <path d="M3.5 11h17v9.5h-17z" />
      <path d="M2.5 7.5h19V11h-19z" />
      <path d="M12 7.5V20.5" />
      <path d="M12 7.5S10.5 3.5 8 3.5a2 2 0 0 0 0 4h4Z" />
      <path d="M12 7.5s1.5-4 4-4a2 2 0 0 1 0 4h-4Z" />
    </svg>
  );
}

function RsvpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...iconProps}>
      <path d="M3 6.5h18v11H3z" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...iconProps}>
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
    </svg>
  );
}

const TABS = [
  { to: "/", label: "Inicio", icon: <HomeIcon />, end: true },
  { to: "/presentes", label: "Presentes", icon: <GiftIcon /> },
  { to: "/rsvp", label: "Presenca", icon: <RsvpIcon /> },
];

function TabShell({
  active,
  label,
  icon,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
}) {
  return (
    <span
      className={`flex h-full w-full flex-col items-center justify-center gap-1 transition-colors ${
        active ? "text-gold" : "text-brown/50"
      }`}
    >
      {icon}
      <span className="text-[10px] uppercase tracking-wide">{label}</span>
    </span>
  );
}

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const moreIsActive = MORE_LINKS.some((link) => link.to === location.pathname);

  return (
    <>
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMoreOpen(false)}
            className="fixed inset-0 z-[60] bg-brown/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {moreOpen && (
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            // Ancorada acima da barra (h-16), para nao ficar escondida atras dela.
            className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-[70] rounded-t-3xl bg-offwhite pb-5 pt-3 shadow-2xl lg:hidden"
          >
            <span className="mx-auto block h-1 w-10 rounded-full bg-brown/20" />
            <ul className="mt-4 flex flex-col px-2">
              {MORE_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-2xl px-5 py-4 text-lg transition-colors ${
                        isActive ? "bg-champagne/50 text-gold" : "text-brown/80"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed inset-x-0 bottom-0 z-[80] border-t border-brown/10 bg-offwhite/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden">
        <ul className="mx-auto grid h-16 max-w-md grid-cols-4">
          {TABS.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end={tab.end}
                onClick={() => setMoreOpen(false)}
                className="block h-full w-full"
              >
                {({ isActive }) => (
                  <TabShell
                    active={isActive && !moreOpen}
                    label={tab.label}
                    icon={tab.icon}
                  />
                )}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              className="block h-full w-full"
            >
              <TabShell
                active={moreOpen || moreIsActive}
                label="Mais"
                icon={<MoreIcon />}
              />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
