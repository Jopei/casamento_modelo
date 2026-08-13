import { useEffect, useState, type FormEvent } from "react";
import { deletePhoto, fetchAdminPhotos, uploadPhoto, type AdminPhoto } from "../../api/admin/photos";

export function PhotosPage() {
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchAdminPhotos().then(setPhotos);

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!image) return;
    setSaving(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      await uploadPhoto(formData);
      setCaption("");
      setImage(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deletePhoto(id);
    await load();
  };

  return (
    <div>
      <h1 className="font-script text-3xl text-gold md:text-4xl">Galeria de Fotos</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm"
      >
        <input
          required
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          className="admin-file"
        />
        <input
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="Legenda (opcional)"
          className="rounded-xl border border-brown/15 px-4 py-2.5 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={saving || !image}
          className="w-fit rounded-full bg-gold px-6 py-2.5 text-sm uppercase tracking-wide text-offwhite hover:bg-gold-light disabled:opacity-60"
        >
          {saving ? "Enviando..." : "Enviar foto"}
        </button>
      </form>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <img src={photo.url} alt={photo.caption ?? ""} className="h-40 w-full object-cover" />
            <div className="p-3">
              <p className="truncate text-sm text-brown/70">{photo.caption}</p>
              <p className="mt-1 text-xs text-brown/40">
                {photo.likes_count} curtidas · {photo.comments_count} comentarios
              </p>
              <button
                onClick={() => handleDelete(photo.id)}
                className="admin-action mt-1 text-red-600"
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
