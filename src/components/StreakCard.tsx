import { Card } from '@/components/ui/Card';

export function StreakCard({ streak }: { streak: number }) {
  const pct = Math.max(0, Math.min(1, streak / 40));
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h3 className="ios-title text-[15px] font-semibold">Racha actual</h3>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{streak} día{streak === 1 ? '' : 's'}</p>
        </div>
        <div className="text-sm font-semibold text-[var(--color-warning)]">{Math.round(pct * 100)}%</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/5">
        <div className="h-full rounded-full bg-[var(--color-warning)]" style={{ width: `${pct * 100}%` }} />
      </div>
    </Card>
  );
}
