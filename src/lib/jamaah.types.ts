import type { Database } from "@/integrations/supabase/types";

// Mirrors the repository's jamaah migration without modifying generated types.
export type JamaahRow = {
  id: string;
  full_name: string;
  label_number: string | null;
  tour_leader: string;
  whatsapp_number: string;
  room_makkah: string;
  room_madinah: string;
  departure_date: string | null;
  label_color: string;
  label_status: string;
  notes: string;
  sort_order: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type JamaahDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: Database["public"]["Tables"] & {
      jamaah: {
        Row: JamaahRow;
        Insert: Pick<JamaahRow, "full_name"> & Partial<Omit<JamaahRow, "full_name">>;
        Update: Partial<JamaahRow>;
        Relationships: [];
      };
    };
  };
};