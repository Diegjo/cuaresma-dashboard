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
        (highlight ? 'bg-[rgba(0,122,255,0.06)]' : '')
      }
    >
      <div className="w-8 text-[18px] font-semibold text-[#8E8E93]">{index}</div>
      <div className="flex-1 min-w-0 text-[18px] font-semibold text-[var(--color-text)] truncate">
        {entry.name}
      </div>
      <div className="w-20 text-right text-[18px] font-semibold text-[var(--color-accent)]">
        {entry.total_points}
      </div>
    </div>
  );
}
