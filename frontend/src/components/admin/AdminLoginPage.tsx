import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function AdminLoginPage() {
  const { admin, ready, expired, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (ready && admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Email ou senha invalidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-10 shadow-lg"
      >
        <div className="text-center">
          <span className="font-script text-4xl text-gold">Admin</span>
          <p className="mt-2 text-sm text-brown/60">
            Acesse o painel do casamento
          </p>
        </div>

        {expired && (
          <p className="mt-6 rounded-xl bg-champagne/50 px-4 py-3 text-sm text-brown/70">
            Sua sessao expirou. Entre novamente.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4">
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="rounded-xl border border-brown/15 bg-offwhite px-4 py-3 text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Senha"
            className="rounded-xl border border-brown/15 bg-offwhite px-4 py-3 text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-wide text-offwhite transition-colors hover:bg-gold-light disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
