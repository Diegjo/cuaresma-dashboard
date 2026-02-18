'use client';

import React from 'react';
import { Toggle } from '@/components/ui/Toggle';

export function HabitItem({
  emoji,
  title,
  checked,
  onChange,
}: {
  emoji: string;
  title: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-lg">
          {emoji}
        </div>
        <div className="text-[15px] text-[var(--color-text)]">{title}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} aria-label={title} />
    </div>
  );
}
