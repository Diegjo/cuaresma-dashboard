'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCurrentUser,
  clearCurrentUser,
  getLeaderboard,
  LeaderboardEntry,
  User,
} from '@/lib/storage';
import { FirstPlaceCard } from '@/components/FirstPlaceCard';
import { LeaderboardItem } from '@/components/LeaderboardItem';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BottomNav } from '@/components/BottomNav';
import { LogOut } from 'lucide-react';

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const load = async () => {
    setLoading(true);
    const data = await getLeaderboard();
    setLeaderboard(data);
    setLoading(false);
  };

  const handleLogout = () => {
    clearCurrentUser();
    router.push('/login');
  };

  const first = useMemo(() => leaderboard[0], [leaderboard]);
  const rest = useMemo(() => leaderboard.slice(1, 15), [leaderboard]);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-28">
      <header className="px-5 pt-7">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-center">
              <div className="text-[24px] font-semibold tracking-wide text-[var(--text)]">RANKING FINDERS</div>
              <div className="mt-1 text-[15px] text-[var(--text-secondary)]">🏆 Cuaresma</div>
            </div>
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

      <main className="px-5 pt-5 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">Cargando…</div>
        ) : (
          <>
            {first && <FirstPlaceCard entry={first} />}

            <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden">
              {rest.map((entry, idx) => (
                <div key={entry.id}>
                  <LeaderboardItem
                    index={idx + 2}
                    entry={entry}
                    highlight={entry.id === user.id}
                  />
                  <div className="h-px bg-[var(--border)]" />
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-[var(--color-text-muted)]">
              Actualizado desde la base de datos
            </p>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
