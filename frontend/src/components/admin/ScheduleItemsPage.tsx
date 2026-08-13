import { useEffect, useState, type FormEvent } from "react";
import {
  createScheduleItem,
  deleteScheduleItem,
  fetchAdminScheduleItems,
} from "../../api/admin/scheduleItems";
import type { ScheduleEventType, ScheduleItem } from "../../types";

export function ScheduleItemsPage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [eventType, setEventType] = useState<ScheduleEventType>("ceremony");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const load = () => fetchAdminScheduleItems().then(setItems);

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createScheduleItem({
        event_type: eventType,
        time,
        title,
        description,
        icon,
        order,
      });
      setTime("");
      setTitle("");
      setDescription("");
      setIcon("");
      setOrder(0);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteScheduleItem(id);
    await load();
  };

  return (
    <div>
      <h1 className="font-script text-3xl text-gold md:text-4xl">Cronograma</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm"
      >
        <select
          value={eventType}
          onChange={(event) => setEventType(event.target.value as ScheduleEventType)}
          className="rounded-xl border border-brown/15 px-4 py-2.5 focus:border-gold focus:outline-none"
        >
          <option value="ceremony">Cerimonia</option>
          <option value="reception">Recepcao</option>
          <option value="other">Outro</option>
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input
            value={time}
            onChange={(event) => setTime(event.target.value)}
            placeholder="Horario (ex: 16:00)"
            className="rounded-xl border border-brown/15 px-4 py-2.5 focus:border-gold focus:outline-none"
          />
          <input
            value={icon}
            onChange={(event) => setIcon(event.target.value)}
            placeholder="Icone (rings, glass, music)"
            className="rounded-xl border border-brown/15 px-4 py-2.5 focus:border-gold focus:outline-none"
          />
        </div>
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
          rows={2}
          className="rounded-xl border border-brown/15 px-4 py-2.5 focus:border-gold focus:outline-none"
        />
        <input
          type="number"
          value={order}
          onChange={(event) => setOrder(Number(event.target.value))}
          placeholder="Ordem"
          className="w-32 rounded-xl border border-brown/15 px-4 py-2.5 focus:border-gold focus:outline-none"
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
            <div>
              <p className="text-xs uppercase tracking-wide text-gold">
                {item.time} · {item.event_type}
              </p>
              <p className="font-semibold text-brown">{item.title}</p>
              <p className="text-sm text-brown/60">{item.description}</p>
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
