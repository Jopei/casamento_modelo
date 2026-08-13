import { motion } from "framer-motion";
import { HeroSlideshow } from "./HeroSlideshow";
import type { WeddingSettings } from "../../types";

interface HeroProps {
  settings: WeddingSettings;
  images: string[];
}

export function Hero({ settings, images }: HeroProps) {
  const date = new Date(settings.wedding_date);
  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-offwhite px-6 pt-24 pb-12 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-sm uppercase tracking-[0.4em] text-gold"
      >
        Estamos nos casando
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-4 font-script text-5xl leading-tight text-brown sm:text-6xl md:text-8xl"
      >
        {settings.groom_name} &amp; {settings.bride_name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="mt-4 text-base tracking-wide text-brown/70 md:mt-6 md:text-lg"
      >
        {formattedDate}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.9 }}
        className="mt-8 h-[45vh] min-h-[260px] w-full max-w-4xl shadow-xl md:mt-12 md:h-[60vh] md:min-h-[320px]"
      >
        <HeroSlideshow images={images} />
      </motion.div>
    </section>
  );
}
