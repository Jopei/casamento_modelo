export interface WeddingSettings {
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  hero_image_url: string | null;
  welcome_message: string | null;
  location_name: string | null;
  location_address: string | null;
  location_map_embed_url: string | null;
  location_directions_url: string | null;
  dress_code_text: string | null;
  dress_code_colors: string[];
}

/** Igual ao publico, mais os dados do PIX que so o painel recebe. */
export interface AdminWeddingSettings extends WeddingSettings {
  pix_key: string | null;
  pix_key_type: string | null;
  pix_merchant_name: string | null;
  pix_city: string | null;
}

export interface StoryItem {
  id: number;
  title: string;
  description: string | null;
  year: string | null;
  image_url: string | null;
  order: number;
}

export type ScheduleEventType = "ceremony" | "reception" | "other";

export interface ScheduleItem {
  id: number;
  event_type: ScheduleEventType;
  time: string | null;
  title: string;
  description: string | null;
  icon: string | null;
  order: number;
}

export interface PhotoComment {
  id: number;
  guest_id: number;
  guest_name: string;
  body: string;
  created_at: string;
}

export interface Photo {
  id: number;
  url: string;
  caption: string | null;
  order: number;
  likes_count: number;
  liked_by_me: boolean;
  comments: PhotoComment[];
}

export interface Gift {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  /** Nulo apenas no card de valor livre. Vem do backend como string decimal. */
  price: string | null;
  quantity: number;
  is_free_amount: boolean;
  reserved_count: number;
  available_count: number;
  is_available: boolean;
}

export type ReservationStatus = "pending" | "paid";

export interface GiftReservationResult {
  id: number;
  amount: string;
  status: ReservationStatus;
  /** Copia e cola do PIX. Nulo quando o casal ainda nao cadastrou a chave. */
  pix_payload: string | null;
}

export interface Guest {
  id: number;
  name: string;
  phone: string;
}

export interface Rsvp {
  id: number;
  guest: { name: string; phone: string };
  attending: boolean;
  companions_count: number;
  message: string | null;
  created_at: string;
}

export interface GiftReservation {
  id: number;
  gift: { id: number; name: string; is_free_amount: boolean };
  guest: { name: string; phone: string };
  amount: string;
  status: ReservationStatus;
  reserved_at: string;
  paid_at: string | null;
}
