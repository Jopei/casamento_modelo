import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Photo } from "../../types";

interface PhotoLightboxProps {
  photo: Photo | null;
  onClose: () => void;
  onToggleLike: (photo: Photo) => void;
  onDownload: (photo: Photo) => void;
  onComment: (photo: Photo, body: string) => Promise<void>;
}

export function PhotoLightbox({
  photo,
  onClose,
  onToggleLike,
  onDownload,
  onComment,
}: PhotoLightboxProps) {
  const [commentBody, setCommentBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleCommentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!photo || !commentBody.trim()) return;

    setSending(true);
    try {
      await onComment(photo, commentBody.trim());
      setCommentBody("");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brown/90 px-4 py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-offwhite shadow-2xl"
          >
            <img
              src={photo.url}
              alt={photo.caption ?? "Foto do casamento"}
              className="max-h-[60vh] w-full object-cover"
            />
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onToggleLike(photo)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    photo.liked_by_me ? "text-gold" : "text-brown/70"
                  }`}
                >
                  {photo.liked_by_me ? "♥" : "♡"} {photo.likes_count}{" "}
                  curtidas
                </button>
                <button
                  onClick={() => onDownload(photo)}
                  className="rounded-full border border-gold px-4 py-1.5 text-sm text-gold transition-colors hover:bg-gold hover:text-offwhite"
                >
                  Baixar
                </button>
              </div>

              {photo.caption && (
                <p className="text-brown/80">{photo.caption}</p>
              )}

              <div className="flex flex-col gap-3 border-t border-brown/10 pt-4">
                {photo.comments.length === 0 && (
                  <p className="text-sm text-brown/50">
                    Seja o primeiro a comentar.
                  </p>
                )}
                {photo.comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-semibold text-brown">
                      {comment.guest_name}
                    </span>{" "}
                    <span className="text-brown/70">{comment.body}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                  placeholder="Deixe um comentario..."
                  className="flex-1 rounded-full border border-brown/15 bg-white px-4 py-2 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full bg-gold px-4 py-2 text-sm text-offwhite transition-colors hover:bg-gold-light disabled:opacity-60"
                >
                  Enviar
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
