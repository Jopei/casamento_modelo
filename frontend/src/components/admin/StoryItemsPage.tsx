import { useEffect, useState, type FormEvent } from "react";
import {
  createStoryItem,
  deleteStoryItem,
  fetchAdminStoryItems,
} from "../../api/admin/storyItems";
import type { StoryItem } from "../../types";

export function StoryItemsPage() {
  const [items, setItems] = useState<StoryItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [order, setOrder] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchAdminStoryItems().then(setItems);

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("year", year);
    formData.append("order", String(order));
    if (image) formData.append("image", image);

    try {
      await createStoryItem(formData);
      setTitle("");
      setDescription("");
      setYear("");
      setOrder(0);
      setImage(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteStoryItem(id);
    await load();
  };

  return (
    <div>
      <h1 className="font-script text-3xl text-gold md:text-4xl">Nossa Historia</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm"
      >
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Titulo"
          className="rounded-xl border border-brown/15 px-4 py-2.5 focus:border-gold focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descricao"
          rows={3}
          className="rounded-xl border border-brown/15 px-4 py-2.5 focus:border-gold focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder="Ano"
            className="rounded-xl border border-brown/15 px-4 py-2.5 focus:border-gold focus:outline-none"
          />
          <input
            type="number"
            value={order}
            onChange={(event) => setOrder(Number(event.target.value))}
            placeholder="Ordem"
            className="rounded-xl border border-brown/15 px-4 py-2.5 focus:border-gold focus:outline-none"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          className="admin-file"
        />
        <button
          type="submit"
          disabled={saving}
          className="w-fit rounded-full bg-gold px-6 py-2.5 text-sm uppercase tracking-wide text-offwhite hover:bg-gold-light disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Adicionar"}
        </button>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-brown">
                  {item.title}{" "}
                  <span className="text-sm text-brown/50">{item.year}</span>
                </p>
                <p className="text-sm text-brown/60">{item.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="admin-action text-red-600"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
