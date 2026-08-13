import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/animations";
import type { ScheduleItem } from "../../types";

interface ScheduleProps {
  items: ScheduleItem[];
}

const ICONS: Record<string, string> = {
  rings: "💍",
  glass: "🥂",
  music: "🎶",
};

export function Schedule({ items }: ScheduleProps) {
  return (
    <section className="bg-champagne/30 px-6 py-16 md:py-28">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-10 text-center md:mb-16"
        >
          <span className="font-script text-3xl text-gold md:text-4xl">Cronograma</span>
        </motion.div>

        <div className="flex flex-col">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="flex gap-6"
            >
              <div className="flex flex-col items-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-lg text-offwhite shadow">
                  {(item.icon && ICONS[item.icon]) ?? "✦"}
                </span>
                {index < items.length - 1 && (
                  <span className="mt-2 w-px flex-1 bg-gold/30" />
                )}
              </div>
              <div className="pb-10">
                <p className="text-sm uppercase tracking-[0.2em] text-gold">
                  {item.time}
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-brown">
                  {item.title}
                </h3>
                <p className="mt-1 text-brown/70">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
