'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CONFIG, Habit } from '@/lib/config';
import {
  getCurrentUser,
  clearCurrentUser,
  getEntryForDate,
  saveEntry,
  calculateTotalPoints,
  calculateCurrentStreak,
  getUserEntries,
  User,
  DailyEntry,
} from '@/lib/storage';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [habits, setHabits] = useState<Record<string, boolean>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    // Cargar datos del usuario
    loadUserData(currentUser.id);
  }, [router]);

  const loadUserData = async (userId: string) => {
    setLoading(true);
    
    // Cargar entrada de hoy
    const entry = await getEntryForDate(userId, today);
    if (entry) {
      setTodayEntry(entry);
      setHabits({
        habit1: entry.habit1,
        habit2: entry.habit2,
        habit3: entry.habit3,
        habit4: entry.habit4,
        habit5: entry.habit5,
        habit6: entry.habit6,
        habit7: entry.habit7,
      });
    }

    // Calcular stats en paralelo
    const [points, userStreak, userEntries] = await Promise.all([
      calculateTotalPoints(userId),
      calculateCurrentStreak(userId),
      getUserEntries(userId),
    ]);

    setTotalPoints(points);
    setStreak(userStreak);
    setEntries(userEntries);
    setLoading(false);
  };

  const handleHabitToggle = (habitId: string) => {
    setHabits((prev) => ({ ...prev, [habitId]: !prev[habitId] }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    
    const completedHabits = Object.values(habits).filter(Boolean).length;
    const entry = {
      userId: user.id,
      date: today,
      habit1: habits.habit1 || false,
      habit2: habits.habit2 || false,
      habit3: habits.habit3 || false,
      habit4: habits.habit4 || false,
      habit5: habits.habit5 || false,
      habit6: habits.habit6 || false,
      habit7: habits.habit7 || false,
      totalPoints: completedHabits,
    };

    await saveEntry(entry);
    
    // Recargar datos
    await loadUserData(user.id);
    
    setSaved(true);
    setSaving(false);

    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    clearCurrentUser();
    router.push('/login');
  };

  const completedCount = Object.values(habits).filter(Boolean).length;
  const progress = (completedCount / CONFIG.habits.length) * 100;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-900">{user.name}</h1>
            <p className="text-xs text-gray-500">
              {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/leaderboard"
              className="text-sm text-violet-600 hover:text-violet-700 font-medium"
            >
              Ranking
            </a>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                <div className="text-2xl font-bold text-violet-600">{totalPoints}</div>
                <div className="text-xs text-gray-500">Puntos</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                <div className="text-2xl font-bold text-orange-500">{streak}</div>
                <div className="text-xs text-gray-500">Racha</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((entries.length / CONFIG.totalDays) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Progreso</div>
              </div>
            </div>

            {/* Hábitos del día */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-gray-900">Retos de hoy</h2>
                  <span className="text-sm text-gray-500">
                    {completedCount}/{CONFIG.habits.length}
                  </span>
                </div>
                {/* Barra de progreso */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="p-2">
                {CONFIG.habits.map((habit: Habit) => (
                  <label
                    key={habit.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      habits[habit.id]
                        ? 'bg-violet-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={habits[habit.id] || false}
                      onChange={() => handleHabitToggle(habit.id)}
                      className="habit-checkbox shrink-0"
                    />
                    <div className="flex-1">
                      <span className="mr-2">{habit.emoji}</span>
                      <span
                        className={`text-sm ${
                          habits[habit.id]
                            ? 'text-gray-500 line-through'
                            : 'text-gray-700'
                        }`}
                      >
                        {habit.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    saved
                      ? 'bg-green-500 text-white'
                      : 'bg-violet-600 hover:bg-violet-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saving ? 'Guardando...' : saved ? '¡Guardado! ✓' : 'Guardar día'}
                </button>
              </div>
            </div>

            {/* Calendario simple */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Calendario</h3>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: CONFIG.totalDays }, (_, i) => {
                  const dayNumber = i + 1;
                  const hasEntry = entries.some((e) => {
                    const entryDate = parseISO(e.date);
                    const startDate = parseISO(CONFIG.startDate);
                    const diffDays = Math.floor(
                      (entryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return diffDays === i && e.total_points > 0;
                  });

                  return (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center rounded-lg ${
                        hasEntry
                          ? 'bg-violet-100 text-violet-700 font-medium'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {dayNumber}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
