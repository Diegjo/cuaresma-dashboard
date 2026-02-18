'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
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
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressCircle } from '@/components/ui/ProgressCircle';
import { HabitItem } from '@/components/HabitItem';
import { StreakCard } from '@/components/StreakCard';
import { CalendarGrid } from '@/components/CalendarGrid';
import { BottomNav } from '@/components/BottomNav';

function useAnimatedNumber(value: number, duration = 350) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;

    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Record<string, boolean>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

    const [points, userStreak, userEntries] = await Promise.all([
      calculateTotalPoints(userId),
      calculateCurrentStreak(userId),
      getUserEntries(userId),
    ]);

    setTotalPoints(points);
    setStreak(userStreak);
    setEntries(userEntries);
    setHasChanges(false);
    setLoading(false);
  };

  const handleHabitToggle = (habitId: string) => {
    setHabits((prev) => ({ ...prev, [habitId]: !prev[habitId] }));
    setHasChanges(true);
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

  const animatedPoints = useAnimatedNumber(totalPoints);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="px-4 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">{dateLabel}</p>
            <h1 className="ios-title mt-1 text-xl font-semibold">Hoy</h1>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[var(--shadow)] border border-black/5">
              <span className="text-sm font-semibold">
                {user.name
                  .split(' ')
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase())
                  .join('')}
              </span>
            </div>
          </button>
        </div>
      </header>

      <main className="px-4 pt-4 space-y-4">
        {loading ? (
          <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">Cargando…</div>
        ) : (
          <>
            {/* Main progress card */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ProgressCircle value={progressValue} size={96} stroke={10} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="ios-title text-lg font-semibold">{completedCount}</div>
                      <div className="text-[11px] text-[var(--color-text-muted)]">de {CONFIG.habits.length}</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="ios-title text-[15px] font-semibold">Hábitos del día</h2>
                    {completedCount === CONFIG.habits.length && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(52,199,89,0.12)] px-2 py-1 text-xs font-semibold text-[var(--color-success)]">
                        <Check size={14} /> Completo
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {completedCount} de {CONFIG.habits.length} hábitos
                  </p>

                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-xs text-[var(--color-text-muted)]">Puntos totales</div>
                      <div className="ios-title text-2xl font-semibold">{animatedPoints}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[var(--color-text-muted)]">Racha</div>
                      <div className="ios-title text-xl font-semibold text-[var(--color-warning)]">🔥 {streak}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Habits */}
            <Card className="overflow-hidden">
              <div className="px-4 pt-4 pb-2">
                <h3 className="ios-title text-[15px] font-semibold">Retos</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Marca lo que completaste hoy</p>
              </div>

              <div className="divide-y divide-black/5">
                {CONFIG.habits.map((habit: Habit) => (
                  <HabitItem
                    key={habit.id}
                    emoji={habit.emoji}
                    title={habit.name}
                    checked={habits[habit.id] || false}
                    onChange={() => handleHabitToggle(habit.id)}
                  />
                ))}
              </div>

              <div className="h-3" />
            </Card>

            <StreakCard streak={streak} />

            {/* Calendar */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="ios-title text-[15px] font-semibold">Calendario</h3>
                <span className="text-xs text-[var(--color-text-muted)]">{CONFIG.totalDays} días</span>
              </div>
              <div className="mt-4">
                <CalendarGrid entries={entries} />
              </div>
            </Card>
          </>
        )}
      </main>

      {/* Sticky save */}
      <AnimateSaveBar
        visible={!loading && hasChanges}
        saving={saving}
        onSave={handleSave}
      />

      <BottomNav />
    </div>
  );
}

function AnimateSaveBar({
  visible,
  saving,
  onSave,
}: {
  visible: boolean;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ y: visible ? 0 : 90, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-[84px] left-0 right-0 z-40 px-4"
    >
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-black/10 bg-white/80 p-2 shadow-[var(--shadow)] backdrop-blur-xl">
          <Button className="w-full" onClick={onSave} disabled={saving} loading={saving}>
            Guardar día
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
