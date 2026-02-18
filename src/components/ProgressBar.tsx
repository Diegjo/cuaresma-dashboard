'use client';

export function ProgressBar({
  value,
  label,
}: {
  value: number; // 0..1
  label: string;
}) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-semibold text-[var(--color-text)]">{label}</div>
        <div className="text-[15px] font-semibold text-[var(--color-text-muted)]">
          {Math.round(pct * 100)}%
        </div>
      </div>

      <div className="mt-3 h-3 w-full rounded-full bg-black/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-300"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
