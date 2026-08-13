import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/animations";
import { GiftCard } from "./GiftCard";
import type { Gift } from "../../types";

interface GiftListProps {
  gifts: Gift[];
  error: string | null;
  pendingGiftId: number | null;
  onReserve: (gift: Gift) => void;
}

export function GiftList({
  gifts,
  error,
  pendingGiftId,
  onReserve,
}: GiftListProps) {
  return (
    <section id="presentes" className="bg-champagne/30 px-4 py-16 sm:px-6 md:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-10 text-center md:mb-16"
        >
          <span className="font-script text-3xl text-gold md:text-4xl">
            Lista de Presentes
          </span>
          <p className="mt-3 text-brown/70">
            Sua presenca ja e o maior presente. Se desejar nos presentear,
            ficaremos felizes com qualquer um destes mimos.
          </p>
        </motion.div>

        {error && (
          <p className="mb-6 rounded-2xl bg-white px-5 py-4 text-center text-sm text-red-600 shadow-sm">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
          {gifts.map((gift) => (
            <motion.div
              key={gift.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="h-full"
            >
              <GiftCard
                gift={gift}
                pending={pendingGiftId === gift.id}
                onReserve={onReserve}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
