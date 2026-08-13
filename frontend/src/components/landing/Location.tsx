import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/animations";
import type { WeddingSettings } from "../../types";

interface LocationProps {
  settings: WeddingSettings;
}

export function Location({ settings }: LocationProps) {
  return (
    <section id="local" className="px-6 py-16 md:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center"
        >
          <span className="font-script text-3xl text-gold md:text-4xl">Local</span>
          <p className="mt-3 text-xl text-brown">{settings.location_name}</p>
          <p className="mt-1 text-brown/70">{settings.location_address}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-10 overflow-hidden rounded-3xl bg-white shadow-lg"
        >
          {settings.location_map_embed_url && (
            <iframe
              src={settings.location_map_embed_url}
              title="Mapa do local"
              className="h-64 w-full border-0 md:h-96"
              loading="lazy"
            />
          )}
          <div className="flex justify-center p-6">
            <a
              href={settings.location_directions_url ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-wide text-offwhite transition-colors hover:bg-gold-light md:px-8"
            >
              Como chegar
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
