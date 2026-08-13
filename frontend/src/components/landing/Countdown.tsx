import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/animations";
import { useCountdown } from "../../hooks/useCountdown";

interface CountdownProps {
  targetDate: string;
}

const UNITS: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] = [
  { key: "days", label: "Dias" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
];

export function Countdown({ targetDate }: CountdownProps) {
  const parts = useCountdown(targetDate);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className="px-6 py-16 md:py-28"
    >
      <div className="mx-auto max-w-3xl rounded-3xl bg-brown px-4 py-10 text-center shadow-xl md:px-8 md:py-12">
        <p className="font-script text-2xl text-champagne md:text-3xl">
          Falta pouco para o grande dia
        </p>
        <div className="mt-8 grid grid-cols-4 gap-2 md:gap-4">
          {UNITS.map((unit) => (
            <div key={unit.key} className="flex flex-col items-center">
              <span className="font-serif text-3xl font-semibold text-offwhite md:text-5xl">
                {String(parts[unit.key]).padStart(2, "0")}
              </span>
              <span className="mt-2 text-[10px] uppercase tracking-[0.15em] text-champagne/70 md:text-xs md:tracking-[0.2em]">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
