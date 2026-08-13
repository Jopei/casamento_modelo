import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/animations";
import { PhotoLightbox } from "./PhotoLightbox";
import type { Photo } from "../../types";

interface GalleryProps {
  photos: Photo[];
  onToggleLike: (photo: Photo) => void;
  onDownload: (photo: Photo) => void;
  onComment: (photo: Photo, body: string) => Promise<void>;
}

export function Gallery({
  photos,
  onToggleLike,
  onDownload,
  onComment,
}: GalleryProps) {
  const [selected, setSelected] = useState<Photo | null>(null);

  const selectedPhoto = selected
    ? photos.find((photo) => photo.id === selected.id) ?? null
    : null;

  return (
    <section id="galeria" className="px-6 py-16 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-10 text-center md:mb-16"
        >
          <span className="font-script text-3xl text-gold md:text-4xl">Galeria</span>
          <p className="mt-3 text-brown/70">
            Curta, comente e baixe suas fotos favoritas.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {photos.map((photo) => (
            <motion.button
              key={photo.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              onClick={() => setSelected(photo)}
              className="group relative aspect-square overflow-hidden rounded-3xl shadow-md"
            >
              <img
                src={photo.url}
                alt={photo.caption ?? "Foto do casamento"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brown/50 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-sm text-offwhite">
                  {photo.liked_by_me ? "♥" : "♡"} {photo.likes_count}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <PhotoLightbox
        photo={selectedPhoto}
        onClose={() => setSelected(null)}
        onToggleLike={onToggleLike}
        onDownload={onDownload}
        onComment={onComment}
      />
    </section>
  );
}
