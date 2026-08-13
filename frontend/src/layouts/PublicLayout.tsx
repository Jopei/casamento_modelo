import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { BottomNav } from "../components/layout/BottomNav";
import { Footer } from "../components/layout/Footer";
import { fetchSettings } from "../api/settings";
import type { WeddingSettings } from "../types";

interface PublicContext {
  settings: WeddingSettings;
}

export function PublicLayout() {
  const [settings, setSettings] = useState<WeddingSettings | null>(null);
  const [failed, setFailed] = useState(false);
  const location = useLocation();

  const loadSettings = useCallback(() => {
    setFailed(false);
    fetchSettings()
      .then(setSettings)
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    if (!settings) return;

    const title = `${settings.groom_name} & ${settings.bride_name}`;
    document.title = title;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    ogTitle?.setAttribute("content", title);

    if (settings.hero_image_url) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement("meta");
        ogImage.setAttribute("property", "og:image");
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute("content", settings.hero_image_url);
    }
  }, [settings]);

  // A navegacao e montada sempre, mesmo antes de as configuracoes
  // chegarem: um erro ou lentidao da API nao pode deixar o convidado sem
  // menu para sair da tela.
  return (
    <>
      <Navbar settings={settings} />
      {/* pb-16 reserva a altura da barra inferior no mobile. */}
      <main className="pb-16 lg:pb-0">
        {settings ? (
          <Outlet context={{ settings } satisfies PublicContext} />
        ) : (
          <SettingsPlaceholder failed={failed} onRetry={loadSettings} />
        )}
      </main>
      {settings && <Footer settings={settings} />}
      <BottomNav />
    </>
  );
}

function SettingsPlaceholder({
  failed,
  onRetry,
}: {
  failed: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      {failed ? (
        <>
          <span className="font-script text-3xl text-gold md:text-4xl">
            Nao conseguimos carregar
          </span>
          <p className="max-w-sm text-brown/70">
            Verifique sua conexao e tente novamente.
          </p>
          <button
            onClick={onRetry}
            className="rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-wide text-offwhite transition-colors hover:bg-gold-light"
          >
            Tentar de novo
          </button>
        </>
      ) : (
        <span className="font-script text-3xl text-gold md:text-4xl">
          Carregando...
        </span>
      )}
    </div>
  );
}

export function usePublicSettings(): WeddingSettings {
  return useOutletContext<PublicContext>().settings;
}
