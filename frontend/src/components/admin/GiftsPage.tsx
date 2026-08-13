import { useEffect, useState, type FormEvent } from "react";
import {
  createGift,
  deleteGift,
  fetchAdminGifts,
  updateGift,
  type AdminGift,
} from "../../api/admin/gifts";
import { formatCurrency } from "../../lib/format";

interface GiftFormState {
  name: string;
  description: string;
  price: string;
  quantity: string;
  isFreeAmount: boolean;
  image: File | null;
}

const EMPTY_FORM: GiftFormState = {
  name: "",
  description: "",
  price: "",
  quantity: "1",
  isFreeAmount: false,
  image: null,
};

const inputClass =
  "rounded-xl border border-brown/15 px-4 py-2.5 text-base focus:border-gold focus:outline-none";

export function GiftsPage() {
  const [gifts, setGifts] = useState<AdminGift[]>([]);
  const [form, setForm] = useState<GiftFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => fetchAdminGifts().then(setGifts);

  useEffect(() => {
    load();
  }, []);

  const set = <K extends keyof GiftFormState>(
    key: K,
    value: GiftFormState[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const startEditing = (gift: AdminGift) => {
    setEditingId(gift.id);
    setError(null);
    setForm({
      name: gift.name,
      description: gift.description ?? "",
      price: gift.price ?? "",
      quantity: String(gift.quantity),
      isFreeAmount: gift.is_free_amount,
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("is_free_amount", form.isFreeAmount ? "1" : "0");
    if (!form.isFreeAmount) {
      formData.append("price", form.price.replace(",", "."));
      formData.append("quantity", form.quantity || "1");
    }
    if (form.image) formData.append("image", form.image);

    try {
      if (editingId) {
        await updateGift(editingId, formData);
      } else {
        await createGift(formData);
      }
      cancelEditing();
      await load();
    } catch {
      setError(
        "Nao foi possivel salvar. Confira o nome e o valor do presente.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (gift: AdminGift) => {
    const confirmed = window.confirm(
      gift.reserved_count > 0
        ? `"${gift.name}" ja foi escolhido por ${gift.reserved_count} convidado(s). Remover mesmo assim?`
        : `Remover "${gift.name}" da lista?`,
    );
    if (!confirmed) return;

    await deleteGift(gift.id);
    if (editingId === gift.id) cancelEditing();
    await load();
  };

  return (
    <div>
      <h1 className="font-script text-3xl text-gold md:text-4xl">
        Lista de Presentes
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:mt-8 md:p-6"
      >
        <p className="text-sm font-semibold text-brown">
          {editingId ? "Editando presente" : "Novo presente"}
        </p>

        <input
          required
          value={form.name}
          onChange={(event) => set("name", event.target.value)}
          placeholder="Nome do presente"
          className={inputClass}
        />
        <textarea
          value={form.description}
          onChange={(event) => set("description", event.target.value)}
          placeholder="Descricao"
          rows={2}
          className={inputClass}
        />

        <label className="flex min-h-11 items-center gap-3 text-sm text-brown/70">
          <input
            type="checkbox"
            checked={form.isFreeAmount}
            onChange={(event) => set("isFreeAmount", event.target.checked)}
            className="h-5 w-5 shrink-0 accent-[var(--color-gold)]"
          />
          Valor livre (o convidado escolhe quanto quer dar)
        </label>

        {!form.isFreeAmount && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-brown/70">
              Valor (R$)
              <input
                required
                inputMode="decimal"
                value={form.price}
                onChange={(event) => set("price", event.target.value)}
                placeholder="150,00"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-brown/70">
              Quantidade aceita
              <input
                type="number"
                min={1}
                max={999}
                value={form.quantity}
                onChange={(event) => set("quantity", event.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        )}

        <label className="flex flex-col gap-1 text-sm text-brown/70">
          Imagem {editingId && "(envie apenas se quiser trocar)"}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => set("image", event.target.files?.[0] ?? null)}
            className="admin-file"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-gold px-6 py-2.5 text-sm uppercase tracking-wide text-offwhite hover:bg-gold-light disabled:opacity-60"
          >
            {saving ? "Salvando..." : editingId ? "Salvar" : "Adicionar"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-full border border-brown/15 px-6 py-2.5 text-sm uppercase tracking-wide text-brown/70 hover:bg-brown/5"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-4">
              {gift.image_url ? (
                <img
                  src={gift.image_url}
                  alt={gift.name}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-champagne text-xs text-brown/40">
                  sem foto
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-brown">{gift.name}</p>
                <p className="text-sm text-brown/60">{gift.description}</p>
                <p className="mt-1 text-sm text-brown/80">
                  {gift.is_free_amount
                    ? "Valor livre"
                    : `${formatCurrency(gift.price)} · ${gift.reserved_count}/${gift.quantity} escolhido(s)`}
                </p>

                {gift.reservations.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-0.5">
                    {gift.reservations.map((reservation) => (
                      <li key={reservation.id} className="text-xs text-gold">
                        {reservation.guest_name} ({reservation.guest_phone}) —{" "}
                        {formatCurrency(reservation.amount)}
                        {reservation.status === "paid"
                          ? " · pago"
                          : " · aguardando pagamento"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex shrink-0 gap-4">
              <button
                onClick={() => startEditing(gift)}
                className="admin-action text-brown/70"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(gift)}
                className="admin-action text-red-600"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
