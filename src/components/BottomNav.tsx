'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy } from 'lucide-react';

const tabs = [
  { href: '/dashboard', label: 'Hoy', icon: Home },
  { href: '/leaderboard', label: 'Ranking', icon: Trophy },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-md px-4 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="rounded-2xl border border-black/10 bg-white/80 shadow-[var(--shadow)] backdrop-blur-xl">
          <div className="grid grid-cols-2">
            {tabs.map((t) => {
              const active = pathname.startsWith(t.href);
              const Icon = t.icon;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`pressable flex flex-col items-center gap-1 py-3 text-xs font-medium ${
                    active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span>{t.label}</span>
                  <span
                    className={`mt-1 h-1 w-10 rounded-full ${
                      active ? 'bg-[var(--color-accent)]' : 'bg-transparent'
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
