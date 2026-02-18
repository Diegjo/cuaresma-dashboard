/************************************
 * Configuración del Reto de Cuaresma - Finders
 ************************************/

export const CONFIG = {
  // Nombre del reto
  appName: 'Reto de Cuaresma - Finders',
  
  // Fechas del reto (40 días)
  startDate: '2025-03-05', // Miércoles de Ceniza
  endDate: '2025-04-13',   // Domingo de Ramos
  totalDays: 40,
  
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
} as const;

// Tipos
export type Habit = {
  id: string;
  name: string;
  emoji: string;
};
