'use client';

import { LargeCheckbox } from '@/components/LargeCheckbox';

export function HabitCard({
  title,
  subtitle,
  emoji,
  background,
  iconBackground,
  checked,
  onToggle,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  background: string;
  iconBackground: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full text-left rounded-2xl px-5 py-5 flex items-center gap-4 pressable"
      style={{ background }}
    >
      <div
        className="h-12 w-12 rounded-full flex items-center justify-center shrink-0"
        style={{ background: iconBackground }}
        aria-hidden
      >
        <span className="text-2xl">{emoji}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[19px] font-semibold text-[var(--color-text)] truncate">
          {title}
        </div>
        <div className="mt-0.5 text-[14px] text-[var(--color-text-muted)] truncate">
          {subtitle}
        </div>
      </div>

      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        <LargeCheckbox checked={checked} onChange={onToggle} ariaLabel={`Marcar ${title}`} />
      </div>
    </button>
  );
}
