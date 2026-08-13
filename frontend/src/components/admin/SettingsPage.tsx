import { useEffect, useState, type FormEvent } from "react";
import { fetchAdminSettings, updateAdminSettings } from "../../api/admin/settings";
import type { AdminWeddingSettings } from "../../types";

export function SettingsPage() {
  const [settings, setSettings] = useState<AdminWeddingSettings | null>(null);
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchAdminSettings().then(setSettings);
  }, []);

  if (!settings) return <p className="text-brown/60">Carregando...</p>;

  const set = <K extends keyof AdminWeddingSettings>(
    key: K,
    value: AdminWeddingSettings[K],
  ) =>
    setSettings((current) => (current ? { ...current, [key]: value } : current));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);

    const formData = new FormData();
    formData.append("bride_name", settings.bride_name);
    formData.append("groom_name", settings.groom_name);
    formData.append("wedding_date", settings.wedding_date);
    formData.append("welcome_message", settings.welcome_message ?? "");
    formData.append("location_name", settings.location_name ?? "");
    formData.append("location_address", settings.location_address ?? "");
    formData.append("location_map_embed_url", settings.location_map_embed_url ?? "");
    formData.append("location_directions_url", settings.location_directions_url ?? "");
    formData.append("dress_code_text", settings.dress_code_text ?? "");
    settings.dress_code_colors.forEach((color) =>
      formData.append("dress_code_colors[]", color),
    );
    formData.append("pix_key", settings.pix_key ?? "");
    formData.append("pix_key_type", settings.pix_key_type ?? "");
    formData.append("pix_merchant_name", settings.pix_merchant_name ?? "");
    formData.append("pix_city", settings.pix_city ?? "");
    if (heroImage) formData.append("hero_image", heroImage);

    try {
      const updated = await updateAdminSettings(formData);
      setSettings(updated);
      setHeroImage(null);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-script text-3xl text-gold md:text-4xl">Configuracoes do site</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm text-brown/70">
            Nome do noivo
            <input
              value={settings.groom_name}
              onChange={(event) => set("groom_name", event.target.value)}
              className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-brown/70">
            Nome da noiva
            <input
              value={settings.bride_name}
              onChange={(event) => set("bride_name", event.target.value)}
              className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-brown/70">
          Data e hora do casamento
          <input
            type="datetime-local"
            value={settings.wedding_date.slice(0, 16)}
            onChange={(event) => set("wedding_date", event.target.value)}
            className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-brown/70">
          Foto do hero
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setHeroImage(event.target.files?.[0] ?? null)}
            className="admin-file"
          />
          {settings.hero_image_url && (
            <img
              src={settings.hero_image_url}
              alt="Hero atual"
              className="mt-2 h-32 w-56 rounded-lg object-cover"
            />
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm text-brown/70">
          Mensagem de boas-vindas
          <textarea
            rows={4}
            value={settings.welcome_message ?? ""}
            onChange={(event) => set("welcome_message", event.target.value)}
            className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-brown/70">
          Nome do local
          <input
            value={settings.location_name ?? ""}
            onChange={(event) => set("location_name", event.target.value)}
            className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-brown/70">
          Endereco
          <input
            value={settings.location_address ?? ""}
            onChange={(event) => set("location_address", event.target.value)}
            className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-brown/70">
          URL do mapa incorporado (embed)
          <input
            value={settings.location_map_embed_url ?? ""}
            onChange={(event) => set("location_map_embed_url", event.target.value)}
            className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-brown/70">
          URL "como chegar"
          <input
            value={settings.location_directions_url ?? ""}
            onChange={(event) => set("location_directions_url", event.target.value)}
            className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-brown/70">
          Texto do dress code
          <textarea
            rows={2}
            value={settings.dress_code_text ?? ""}
            onChange={(event) => set("dress_code_text", event.target.value)}
            className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-brown/70">
          Cores do dress code (hex, separadas por virgula)
          <input
            value={settings.dress_code_colors.join(", ")}
            onChange={(event) =>
              set(
                "dress_code_colors",
                event.target.value.split(",").map((color) => color.trim()).filter(Boolean),
              )
            }
            className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
          />
          <div className="mt-1 flex gap-2">
            {settings.dress_code_colors.map((color, index) => (
              <span
                key={`${color}-${index}`}
                className="h-6 w-6 rounded-full border border-brown/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </label>

        <fieldset className="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:p-6">
          <legend className="px-2 text-sm font-semibold text-brown">
            PIX para os presentes
          </legend>
          <p className="text-xs text-brown/60">
            O QR Code e o codigo copia e cola sao gerados a partir destes dados.
            Nome do recebedor e cidade tem limite de 25 e 15 caracteres, exigido
            pelo padrao do Banco Central.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-brown/70">
              Chave PIX
              <input
                value={settings.pix_key ?? ""}
                onChange={(event) => set("pix_key", event.target.value)}
                placeholder="CPF, celular, e-mail ou chave aleatoria"
                className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-brown/70">
              Tipo da chave
              <select
                value={settings.pix_key_type ?? ""}
                onChange={(event) => set("pix_key_type", event.target.value)}
                className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
              >
                <option value="">Selecione</option>
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="phone">Celular</option>
                <option value="email">E-mail</option>
                <option value="random">Chave aleatoria</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-brown/70">
              Nome do recebedor (max. 25)
              <input
                maxLength={25}
                value={settings.pix_merchant_name ?? ""}
                onChange={(event) => set("pix_merchant_name", event.target.value)}
                placeholder="Joaquim e Maria"
                className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-brown/70">
              Cidade (max. 15)
              <input
                maxLength={15}
                value={settings.pix_city ?? ""}
                onChange={(event) => set("pix_city", event.target.value)}
                placeholder="Sao Paulo"
                className="rounded-xl border border-brown/15 px-4 py-2.5 text-brown focus:border-gold focus:outline-none"
              />
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-fit rounded-full bg-gold px-8 py-3 text-sm uppercase tracking-wide text-offwhite transition-colors hover:bg-gold-light disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar alteracoes"}
        </button>
        {saved && <p className="text-sm text-green-700">Alteracoes salvas!</p>}
      </form>
    </div>
  );
}
