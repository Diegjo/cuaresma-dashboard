'use client';

import { LeaderboardEntry } from '@/lib/storage';

export function LeaderboardItem({
  index,
  entry,
  highlight,
}: {
  index: number;
  entry: LeaderboardEntry;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        'px-5 py-4 flex items-center gap-3 ' +
        (highlight ? 'bg-[var(--accent-soft)]' : '')
      }
    >
      <div className="w-8 text-[18px] font-semibold text-[var(--text-tertiary)]">{index}</div>
      <div className="flex-1 min-w-0 text-[18px] font-semibold text-[var(--text)] truncate">
        {entry.name}
      </div>
      <div className="w-20 text-right text-[18px] font-semibold text-[var(--accent)]">
        {entry.total_points}
      </div>
    </div>
  );
}
