import { motion } from "framer-motion";
import { fadeIn, viewportOnce } from "../../lib/animations";
import type { WeddingSettings } from "../../types";

interface FooterProps {
  settings: WeddingSettings;
}

export function Footer({ settings }: FooterProps) {
  const date = new Date(settings.wedding_date);
  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeIn}
      className="bg-brown px-6 py-16 text-center text-offwhite"
    >
      <p className="mx-auto max-w-md font-serif text-lg leading-relaxed text-champagne">
        Obrigado por fazer parte da nossa historia e por celebrar este novo
        capitulo ao nosso lado.
      </p>
      <p className="mt-6 font-script text-4xl text-offwhite">
        {settings.groom_name} &amp; {settings.bride_name}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.3em] text-champagne/70">
        {formattedDate}
      </p>
    </motion.footer>
  );
}
