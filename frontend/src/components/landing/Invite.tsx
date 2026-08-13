import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/animations";
import type { WeddingSettings } from "../../types";

interface InviteProps {
  settings: WeddingSettings;
}

export function Invite({ settings }: InviteProps) {
  const date = new Date(settings.wedding_date);
  const formattedDate = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="bg-champagne/30 px-6 py-16 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="mx-auto max-w-xl rounded-[2.5rem] border-2 border-gold/40 bg-offwhite px-5 py-12 text-center shadow-xl md:px-8 md:py-16"
      >
        <p className="text-sm uppercase tracking-[0.4em] text-gold">
          Convite
        </p>
        <p className="mt-8 font-serif text-lg text-brown/80">
          Com a benção de Deus e de nossas familias
        </p>
        <p className="mt-4 font-script text-4xl text-brown md:text-5xl">
          {settings.groom_name} &amp; {settings.bride_name}
        </p>
        <p className="mt-6 font-serif text-lg text-brown/80">
          convidam para celebrar o seu casamento
        </p>
        <p className="mt-8 text-brown">
          <span className="block text-lg capitalize">{formattedDate}</span>
          <span className="mt-1 block text-lg">as {formattedTime}</span>
        </p>
        {settings.location_name && (
          <p className="mt-6 font-script text-2xl text-gold">
            {settings.location_name}
          </p>
        )}
      </motion.div>
    </section>
  );
}
