import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/animations";
import type { WeddingSettings } from "../../types";

interface DressCodeProps {
  settings: WeddingSettings;
}

export function DressCode({ settings }: DressCodeProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className="px-6 py-16 md:py-28"
    >
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 text-center shadow-lg md:p-10">
        <span className="font-script text-3xl text-gold md:text-4xl">Dress Code</span>
        <p className="mt-6 text-lg text-brown/80">{settings.dress_code_text}</p>

        <div className="mt-8 flex justify-center gap-3">
          {settings.dress_code_colors.map((color) => (
            <span
              key={color}
              className="h-10 w-10 rounded-full border border-brown/10 shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
