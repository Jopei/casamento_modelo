import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/animations";
import type { WeddingSettings } from "../../types";

interface WelcomeProps {
  settings: WeddingSettings;
}

export function Welcome({ settings }: WelcomeProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className="mx-auto max-w-2xl px-6 py-16 text-center md:py-28"
    >
      <span className="font-script text-3xl text-gold md:text-4xl">Bem-vindos</span>
      <p className="mt-6 font-serif text-lg leading-relaxed text-brown/80 md:mt-8 md:text-2xl">
        {settings.welcome_message}
      </p>
    </motion.section>
  );
}
