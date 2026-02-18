'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { CONFIG, Habit } from '@/lib/config';
import {
  getCurrentUser,
  clearCurrentUser,
  getEntryForDate,
  saveEntry,
  calculateCurrentStreak,
  getUserEntries,
  User,
  DailyEntry,
} from '@/lib/storage';
import { ProgressBar } from '@/components/ProgressBar';
import { HabitCard } from '@/components/HabitCard';
import { BottomNav } from '@/components/BottomNav';

const HABIT_UI: Record<
  string,
  { subtitle: string; background: string; iconBackground: string }
> = {
  habit1: {
    subtitle: 'Entrenamiento o actividad física',
    background: '#E8F4E8',
    iconBackground: 'rgba(52,199,89,0.18)',
  },
  habit2: {
    subtitle: 'Comer más sano hoy',
    background: '#FFF2E8',
    iconBackground: 'rgba(255,149,0,0.18)',
  },
  habit3: {
    subtitle: 'Cuidar mente y corazón',
    background: '#F0E8F4',
    iconBackground: 'rgba(175,82,222,0.18)',
  },
  habit4: {
    subtitle: 'Levantarte temprano',
    background: '#FFF9E8',
    iconBackground: 'rgba(255,204,0,0.22)',
  },
  habit5: {
    subtitle: 'Leer y aprender',
    background: '#E8F0F4',
    iconBackground: 'rgba(90,200,250,0.22)',
  },
  habit6: {
    subtitle: 'Oración del día',
    background: '#F4E8E8',
    iconBackground: 'rgba(255,45,85,0.15)',
  },
  habit7: {
    subtitle: 'Ofrecer un rosario',
    background: '#E8E8F4',
    iconBackground: 'rgba(99,102,241,0.20)',
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(0);
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

    const [userStreak, userEntries] = await Promise.all([
      calculateCurrentStreak(userId),
      getUserEntries(userId),
    ]);

    setStreak(userStreak);
    setEntries(userEntries);
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
    <div className="min-h-screen pb-28">
      <header className="px-5 pt-7">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[22px] font-semibold text-[var(--color-text)]">
              Hola, {user.name.split(' ')[0]}
            </div>
            <div className="mt-1 text-[15px] text-[var(--color-text-muted)]">{dateLabel}</div>
          </div>

          <button
            onClick={handleLogout}
            className="h-11 w-11 rounded-full bg-white border border-black/5 shadow-[var(--shadow)] flex items-center justify-center"
            aria-label="Cerrar sesión"
          >
            <span className="text-sm font-semibold">
              {user.name
                .split(' ')
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase())
                .join('')}
            </span>
          </button>
        </div>
      </header>

      <main className="px-5 pt-5">
        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">Cargando…</div>
        ) : (
          <>
            <div className="rounded-3xl bg-white shadow-[var(--shadow)] border border-black/5 p-5">
              <ProgressBar
                value={progressValue}
                label={`${completedCount}/${CONFIG.habits.length} hábitos`}
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-[16px] text-[var(--color-text-muted)]">Racha</div>
                <div className="text-[18px] font-semibold text-[var(--color-warning)]">
                  🔥 {streak}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {CONFIG.habits.map((habit: Habit) => {
                const ui = HABIT_UI[habit.id];
                return (
                  <HabitCard
                    key={habit.id}
                    emoji={habit.emoji}
                    title={habit.name}
                    subtitle={ui?.subtitle ?? 'Completa el hábito'}
                    background={ui?.background ?? '#FFFFFF'}
                    iconBackground={ui?.iconBackground ?? 'rgba(0,0,0,0.06)'}
                    checked={habits[habit.id] || false}
                    onToggle={() => handleHabitToggle(habit.id)}
                  />
                );
              })}
            </div>

            <div className="h-24" />
          </>
        )}
      </main>

      <motion.div
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-[84px] left-0 right-0 z-40 px-5"
      >
        <div className="mx-auto max-w-[430px]">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full h-14 rounded-2xl bg-[#007AFF] text-white font-semibold shadow-[var(--shadow)] disabled:opacity-60"
          >
            {saving ? 'Guardando…' : '💾 Guardar Día'}
          </button>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
