import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/animations";
import type { StoryItem } from "../../types";

interface StoryProps {
  items: StoryItem[];
}

export function Story({ items }: StoryProps) {
  return (
    <section id="historia" className="bg-champagne/30 px-6 py-16 md:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-10 text-center md:mb-16"
        >
          <span className="font-script text-3xl text-gold md:text-4xl">Nossa Historia</span>
        </motion.div>

        <div className="flex flex-col gap-10 md:gap-16">
          {items.map((item, index) => {
            const reversed = index % 2 === 1;

            return (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={fadeUp}
                className={`flex flex-col items-center gap-8 md:flex-row ${
                  reversed ? "md:flex-row-reverse" : ""
                }`}
              >
                {item.image_url && (
                  <div className="w-full max-w-sm shrink-0 overflow-hidden rounded-3xl shadow-lg">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-56 w-full object-cover md:h-72"
                    />
                  </div>
                )}
                <div className="text-center md:text-left">
                  {item.year && (
                    <span className="text-sm uppercase tracking-[0.3em] text-gold">
                      {item.year}
                    </span>
                  )}
                  <h3 className="mt-2 font-serif text-2xl font-semibold text-brown">
                    {item.title}
                  </h3>
                  {/* whitespace-pre-line preserva as quebras de paragrafo
                      do texto cadastrado no painel. */}
                  <p className="mt-3 max-w-prose whitespace-pre-line text-brown/75">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
