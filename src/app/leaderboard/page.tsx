'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import {
  getCurrentUser,
  clearCurrentUser,
  getLeaderboard,
  LeaderboardEntry,
  User,
} from '@/lib/storage';
import { Card } from '@/components/ui/Card';
import { BottomNav } from '@/components/BottomNav';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

function colorFor(id: string) {
  // deterministic pleasant pastel
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return `hsl(${h} 70% 92%)`;
}

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

  const top3 = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-28">
      <header className="px-4 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Ranking</p>
            <h1 className="ios-title mt-1 text-xl font-semibold">Tabla</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[var(--shadow)] border border-black/5">
              <span className="text-sm font-semibold">{initials(user.name)}</span>
            </div>
          </button>
        </div>
      </header>

      <main className="px-4 pt-4 space-y-4">
        {loading ? (
          <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">Cargando…</div>
        ) : (
          <>
            {leaderboard.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Trophy size={18} />
                  <h2 className="ios-title text-[15px] font-semibold">Top 3</h2>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 items-end">
                  {[1, 0, 2].map((idx, i) => {
                    const p = top3[idx];
                    if (!p) return <div key={i} />;
                    const isFirst = idx === 0;
                    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className={`${isFirst ? 'pt-0' : 'pt-4'}`}
                      >
                        <div className="text-center">
                          <div
                            className={`mx-auto flex items-center justify-center rounded-full border border-black/5 shadow-[var(--shadow)] ${
                              isFirst ? 'h-16 w-16 text-2xl' : 'h-12 w-12 text-xl'
                            }`}
                            style={{ background: colorFor(p.id) }}
                          >
                            {medal}
                          </div>
                          <div className="mt-2 text-sm font-semibold truncate">{p.name}</div>
                          <div className="ios-title text-xl font-semibold">{p.total_points}</div>
                          <div className="text-xs text-[var(--color-warning)]">🔥 {p.current_streak}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            )}

            <Card className="overflow-hidden">
              <div className="px-4 py-3 border-b border-black/5 bg-white/60">
                <div className="flex text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  <span className="w-10">#</span>
                  <span className="flex-1">Persona</span>
                  <span className="w-16 text-right">Puntos</span>
                </div>
              </div>

              <div className="divide-y divide-black/5">
                {leaderboard.map((p, idx) => {
                  const me = p.id === user.id;
                  return (
                    <div key={p.id} className={`px-4 py-3 flex items-center gap-3 ${me ? 'bg-[rgba(0,122,255,0.06)]' : ''}`}>
                      <div className="w-10 text-sm font-semibold text-[var(--color-text-muted)]">{idx + 1}</div>

                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center border border-black/5"
                        style={{ background: colorFor(p.id) }}
                      >
                        <span className="text-xs font-semibold">{initials(p.name)}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="truncate text-sm font-semibold">{p.name}</div>
                          {me && (
                            <span className="rounded-full bg-[rgba(0,122,255,0.12)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-accent)]">
                              Tú
                            </span>
                          )}
                        </div>
                        {p.current_streak > 0 && (
                          <div className="mt-0.5 text-xs text-[var(--color-warning)]">🔥 Racha {p.current_streak}</div>
                        )}
                      </div>

                      <div className="w-16 text-right ios-title text-sm font-semibold">{p.total_points}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

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
