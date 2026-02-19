'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { CONFIG, Habit } from '@/lib/config';
import {
  getCurrentUser,
  clearCurrentUser,
  getEntryForDate,
  saveEntry,
  calculateCurrentStreak,
  getUserEntries,
  calculateTotalPoints,
  User,
  DailyEntry,
} from '@/lib/storage';
import { StatsGrid } from '@/components/StatsGrid';
import { HabitCard } from '@/components/HabitCard';
import { BottomNav } from '@/components/BottomNav';
import { LogOut, Calendar } from 'lucide-react';

// Use CSS variables via inline styles or tailwind classes
const HABIT_UI: Record<
  string,
  { subtitle: string; background: string; iconBackground: string }
> = {
  habit1: {
    subtitle: 'Entrenamiento o actividad física',
    background: 'var(--surface)',
    iconBackground: 'var(--habit-1-icon-bg)',
  },
  habit2: {
    subtitle: 'Comer más sano hoy',
    background: 'var(--surface)',
    iconBackground: 'var(--habit-2-icon-bg)',
  },
  habit3: {
    subtitle: 'Cuidar mente y corazón',
    background: 'var(--surface)',
    iconBackground: 'var(--habit-3-icon-bg)',
  },
  habit4: {
    subtitle: 'Levantarte temprano',
    background: 'var(--surface)',
    iconBackground: 'var(--habit-4-icon-bg)',
  },
  habit5: {
    subtitle: 'Leer y aprender',
    background: 'var(--surface)',
    iconBackground: 'var(--habit-5-icon-bg)',
  },
  habit6: {
    subtitle: 'Oración del día',
    background: 'var(--surface)',
    iconBackground: 'var(--habit-6-icon-bg)',
  },
  habit7: {
    subtitle: 'Ofrecer un rosario',
    background: 'var(--surface)',
    iconBackground: 'var(--habit-7-icon-bg)',
  },
};

import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
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
    loadUserData(currentUser.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadUserData = async (userId: string) => {
    setLoading(true);

    const entry = await getEntryForDate(userId, today);
    if (entry) {
      setHabits({
        habit1: entry.habit1,
        habit2: entry.habit2,
        habit3: entry.habit3,
        habit4: entry.habit4,
        habit5: entry.habit5,
        habit6: entry.habit6,
        habit7: entry.habit7,
      });
    } else {
      const init: Record<string, boolean> = {};
      CONFIG.habits.forEach((h) => (init[h.id] = false));
      setHabits(init);
    }

    const [userStreak, userEntries, points] = await Promise.all([
      calculateCurrentStreak(userId),
      getUserEntries(userId),
      calculateTotalPoints(userId),
    ]);

    setStreak(userStreak);
    setEntries(userEntries);
    setTotalPoints(points);
    setLoading(false);
  };

  const handleHabitToggle = (habitId: string) => {
    setHabits((prev) => ({ ...prev, [habitId]: !prev[habitId] }));
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
    await loadUserData(user.id);
    setSaving(false);
  };

  const handleLogout = () => {
    clearCurrentUser();
    router.push('/login');
  };

  const completedCount = Object.values(habits).filter(Boolean).length;
  const progressValue = completedCount / CONFIG.habits.length;

  const dateLabel = useMemo(
    () => format(new Date(), "EEEE, d 'de' MMMM", { locale: es }),
    []
  );

  if (!user) return null;

  return (
    <div className="min-h-screen pb-32 bg-[var(--bg-subtle)]">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-[var(--bg-subtle)] sticky top-0 z-20 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-1">
              <Calendar size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">{dateLabel}</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
              Hola, {user.name.split(' ')[0]}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="h-10 w-10 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm flex items-center justify-center hover:bg-[var(--bg-subtle)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text)]"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
             <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
             <p className="text-sm text-[var(--text-secondary)]">Cargando tu progreso...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <StatsGrid
              progress={progressValue}
              completedCount={completedCount}
              totalHabits={CONFIG.habits.length}
              streak={streak}
              totalPoints={totalPoints}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-[var(--text)]">Tus Hábitos</h2>
                <span className="text-xs font-medium text-[var(--text-tertiary)] bg-[var(--surface)] px-2 py-1 rounded-full border border-[var(--border)]">
                  {completedCount}/{CONFIG.habits.length}
                </span>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {CONFIG.habits.map((habit: Habit, index: number) => {
                    const ui = HABIT_UI[habit.id];
                    return (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <HabitCard
                          title={habit.name}
                          subtitle={ui?.subtitle ?? 'Completa el hábito'}
                          emoji={habit.emoji}
                          background={ui?.background ?? '#FFFFFF'}
                          iconBackground={ui?.iconBackground ?? '#F5F5F5'}
                          checked={habits[habit.id] || false}
                          onToggle={() => handleHabitToggle(habit.id)}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="h-24" />
          </motion.div>
        )}
      </main>

      {/* Floating Action Button for Save */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[90px] left-0 right-0 z-40 px-6 pointer-events-none"
          >
            <div className="mx-auto max-w-[430px] flex justify-center pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className={`
                  h-14 px-8 rounded-full shadow-xl font-semibold text-[var(--primary-foreground)] flex items-center gap-2 backdrop-blur-sm transition-all duration-300
                  ${saving 
                    ? 'bg-[var(--text-secondary)] cursor-not-allowed' 
                    : 'bg-[var(--primary)] hover:bg-[var(--text)] shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
                  }
                `}
              >
                {saving ? (
                   <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Guardando...</span>
                   </>
                ) : (
                  <>
                    <span>Guardar Progreso</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs font-mono ml-1">
                       {completedCount}/{CONFIG.habits.length}
                    </span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
