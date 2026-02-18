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
import { BottomNav } from '@/components/BottomNav';

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
              <div className="text-[24px] font-semibold tracking-wide">RANKING FINDERS</div>
              <div className="mt-1 text-[15px] text-[var(--color-text-muted)]">🏆 Cuaresma</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="-mt-1 h-11 w-11 rounded-full bg-white border border-black/5 shadow-[var(--shadow)] flex items-center justify-center"
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

      <main className="px-5 pt-5 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">Cargando…</div>
        ) : (
          <>
            {first && <FirstPlaceCard entry={first} />}

            <div className="rounded-3xl bg-white border border-black/5 shadow-[var(--shadow)] overflow-hidden">
              {rest.map((entry, idx) => (
                <div key={entry.id}>
                  <LeaderboardItem
                    index={idx + 2}
                    entry={entry}
                    highlight={entry.id === user.id}
                  />
                  <div className="h-px bg-[#E5E5EA]" />
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
