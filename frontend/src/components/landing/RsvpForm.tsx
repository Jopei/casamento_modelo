import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/animations";

export interface RsvpFormValues {
  name: string;
  phone: string;
  companionsCount: number;
  message: string;
}

interface RsvpFormProps {
  onSubmit: (values: RsvpFormValues) => Promise<void> | void;
  submitted?: boolean;
}

export function RsvpForm({ onSubmit, submitted }: RsvpFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companionsCount, setCompanionsCount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, phone, companionsCount, message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="px-6 py-16 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="mx-auto max-w-lg rounded-3xl bg-white p-6 shadow-lg md:p-10"
      >
        <div className="text-center">
          <span className="font-script text-3xl text-gold md:text-4xl">
            Confirme sua Presenca
          </span>
          <p className="mt-3 text-brown/70">
            Contamos com voce para celebrar esse momento.
          </p>
        </div>

        {submitted ? (
          <p className="mt-8 text-center text-lg text-gold">
            Presenca confirmada! Ate breve. ✨
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu nome completo"
              className="rounded-xl border border-brown/15 bg-offwhite px-4 py-3 text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
            />
            <input
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Seu telefone"
              className="rounded-xl border border-brown/15 bg-offwhite px-4 py-3 text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
            />
            <label className="text-sm text-brown/70">
              Numero de acompanhantes
              <input
                type="number"
                min={0}
                max={20}
                value={companionsCount}
                onChange={(event) =>
                  setCompanionsCount(Number(event.target.value))
                }
                className="mt-1 w-full rounded-xl border border-brown/15 bg-offwhite px-4 py-3 text-brown focus:border-gold focus:outline-none"
              />
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Deixe uma mensagem para os noivos (opcional)"
              rows={3}
              className="rounded-xl border border-brown/15 bg-offwhite px-4 py-3 text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-wide text-offwhite transition-colors hover:bg-gold-light disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Confirmar presenca"}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
