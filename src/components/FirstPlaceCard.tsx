'use client';

import { LeaderboardEntry } from '@/lib/storage';

export function FirstPlaceCard({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div className="rounded-3xl bg-[#6366F1] text-white px-5 py-5 shadow-[var(--shadow)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
            1° Lugar
          </div>
          <div className="mt-2 text-2xl font-semibold leading-tight">{entry.name}</div>
          <div className="mt-2 text-white/90 text-sm">🔥 Racha {entry.current_streak}</div>
        </div>

        <div className="text-right">
          <div className="text-3xl">🥇</div>
          <div className="mt-2 text-3xl font-semibold leading-none">{entry.total_points}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/80">
            Puntos
          </div>
        </div>
      </div>
    </div>
  );
}
