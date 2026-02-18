'use client';

import { parseISO } from 'date-fns';
import { CONFIG } from '@/lib/config';
import type { DailyEntry } from '@/lib/storage';

export function CalendarGrid({ entries }: { entries: DailyEntry[] }) {
  const startDate = parseISO(CONFIG.startDate);
  const today = new Date();

  const dayState = (i: number) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);

    const isFuture = d.getTime() > new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    const hasEntry = entries.some((e) => {
      const entryDate = parseISO(e.date);
      const diffDays = Math.floor((entryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays === i && (e.total_points ?? 0) > 0;
    });

    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    return { hasEntry, isToday, isFuture };
  };

  return (
    <div className="grid grid-cols-8 gap-2">
      {Array.from({ length: CONFIG.totalDays }, (_, i) => {
        const s = dayState(i);
        return (
          <div
            key={i}
            className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-medium ${
              s.hasEntry
                ? 'bg-[var(--color-success)] text-white'
                : s.isFuture
                ? 'bg-black/5 text-[var(--color-text-muted)]'
                : 'bg-white text-[var(--color-text-muted)] border border-black/5'
            } ${s.isToday ? 'ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg)]' : ''}`}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
  );
}
