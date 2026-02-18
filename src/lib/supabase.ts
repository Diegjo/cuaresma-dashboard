import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para las tablas de Supabase
export type User = {
  id: string;
  name: string;
  pin: string;
  total_points: number;
  created_at: string;
};

export type DailyEntry = {
  id: string;
  user_id: string;
  date: string;
  habit1: boolean;
  habit2: boolean;
  habit3: boolean;
  habit4: boolean;
  habit5: boolean;
  habit6: boolean;
  habit7: boolean;
  total_points: number;
  created_at: string;
  updated_at: string;
};
