import { supabase, User, DailyEntry } from './supabase';

// LocalStorage keys (solo para sesión del usuario actual)
const STORAGE_KEYS = {
  currentUser: 'cuaresma_user',
};

// ====== SESIÓN DE USUARIO (LocalStorage) ======

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(STORAGE_KEYS.currentUser);
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
}

export function clearCurrentUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.currentUser);
}

// ====== AUTENTICACIÓN ======

export async function loginUser(name: string, pin: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('name', name)
    .eq('pin', pin)
    .single();

  if (error || !data) {
    return null;
  }

  return data as User;
}

// ====== ENTRADAS DIARIAS ======

export async function getEntryForDate(userId: string, date: string): Promise<DailyEntry | null> {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (error || !data) {
    return null;
  }

  return data as DailyEntry;
}

export async function getUserEntries(userId: string): Promise<DailyEntry[]> {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as DailyEntry[];
}

export async function saveEntry(entry: {
  userId: string;
  date: string;
  habit1: boolean;
  habit2: boolean;
  habit3: boolean;
  habit4: boolean;
  habit5: boolean;
  habit6: boolean;
  habit7: boolean;
  totalPoints: number;
}): Promise<DailyEntry | null> {
  const { data, error } = await supabase
    .from('daily_entries')
    .upsert({
      user_id: entry.userId,
      date: entry.date,
      habit1: entry.habit1,
      habit2: entry.habit2,
      habit3: entry.habit3,
      habit4: entry.habit4,
      habit5: entry.habit5,
      habit6: entry.habit6,
      habit7: entry.habit7,
      total_points: entry.totalPoints,
    }, {
      onConflict: 'user_id,date'
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving entry:', error);
    return null;
  }

  // Actualizar total_points del usuario
  await updateUserTotalPoints(entry.userId);

  return data as DailyEntry;
}

async function updateUserTotalPoints(userId: string): Promise<void> {
  // Calcular el total de puntos sumando todas las entradas
  const { data } = await supabase
    .from('daily_entries')
    .select('total_points')
    .eq('user_id', userId);

  const totalPoints = data?.reduce((sum, entry) => sum + (entry.total_points || 0), 0) || 0;

  await supabase
    .from('users')
    .update({ total_points: totalPoints })
    .eq('id', userId);
}

// ====== CÁLCULOS ======

export async function calculateTotalPoints(userId: string): Promise<number> {
  const { data } = await supabase
    .from('daily_entries')
    .select('total_points')
    .eq('user_id', userId);

  return data?.reduce((sum, entry) => sum + (entry.total_points || 0), 0) || 0;
}

export async function calculateCurrentStreak(userId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_user_streak', { user_uuid: userId });

  if (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }

  return data || 0;
}

// ====== LEADERBOARD ======

export type LeaderboardEntry = User & {
  current_streak: number;
};

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  // Obtener todos los usuarios
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .order('total_points', { ascending: false });

  if (usersError || !users) {
    return [];
  }

  // Calcular racha para cada usuario
  const leaderboardWithStreaks = await Promise.all(
    users.map(async (user) => {
      const { data: streak } = await supabase
        .rpc('get_user_streak', { user_uuid: user.id });

      return {
        ...user,
        current_streak: streak || 0,
      };
    })
  );

  // Ordenar por puntos totales (descendente)
  return leaderboardWithStreaks.sort((a, b) => b.total_points - a.total_points);
}

// ====== TODOS LOS USUARIOS ======

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name');

  if (error || !data) {
    return [];
  }

  return data as User[];
}
