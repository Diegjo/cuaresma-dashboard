/************************************
 * Configuración del Reto de Cuaresma
 ************************************/

export const CONFIG = {
  // Nombre del reto
  appName: 'Reto de Cuaresma',
  
  // Fechas del reto (40 días)
  startDate: '2025-03-05', // Miércoles de Ceniza
  endDate: '2025-04-13',   // Domingo de Ramos
  totalDays: 40,
  
  // Lista de participantes (15 amigos)
  participants: [
    { id: '1', name: 'Amigo 1', pin: '1001' },
    { id: '2', name: 'Amigo 2', pin: '1002' },
    { id: '3', name: 'Amigo 3', pin: '1003' },
    { id: '4', name: 'Amigo 4', pin: '1004' },
    { id: '5', name: 'Amigo 5', pin: '1005' },
    { id: '6', name: 'Amigo 6', pin: '1006' },
    { id: '7', name: 'Amigo 7', pin: '1007' },
    { id: '8', name: 'Amigo 8', pin: '1008' },
    { id: '9', name: 'Amigo 9', pin: '1009' },
    { id: '10', name: 'Amigo 10', pin: '1010' },
    { id: '11', name: 'Amigo 11', pin: '1011' },
    { id: '12', name: 'Amigo 12', pin: '1012' },
    { id: '13', name: 'Amigo 13', pin: '1013' },
    { id: '14', name: 'Amigo 14', pin: '1014' },
    { id: '15', name: 'Amigo 15', pin: '1015' },
  ],
  
  // Hábitos a seguir
  habits: [
    { id: 'habit1', name: 'Ejercicio 5 días a la semana', emoji: '💪' },
    { id: 'habit2', name: 'No frituras ni refresco', emoji: '🥗' },
    { id: 'habit3', name: 'No actos ni pensamientos impuros', emoji: '🕊️' },
    { id: 'habit4', name: 'Despertarse temprano', emoji: '🌅' },
    { id: 'habit5', name: 'Leer un libro que nutra la mente', emoji: '📚' },
    { id: 'habit6', name: 'Rezar mañana, tarde y noche', emoji: '🙏' },
    { id: 'habit7', name: 'Misterio o Rosario', emoji: '📿' },
  ],
  
  // Puntos por hábito completado
  pointsPerHabit: 1,
  maxPointsPerDay: 7,
  
  // Supabase config (reemplazar con tus credenciales)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
} as const;

// Tipos
export type User = {
  id: string;
  name: string;
  pin: string;
  totalPoints: number;
  currentStreak: number;
};

export type DailyEntry = {
  id: string;
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
};

export type Habit = {
  id: string;
  name: string;
  emoji: string;
};
