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
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-[430px] px-6 pb-6 pt-0 pointer-events-auto">
        <div className="rounded-full bg-[rgba(255,255,255,0.85)] backdrop-blur-xl border border-[var(--border)] shadow-lg flex justify-around items-center h-16 relative">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.href);
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                  active ? 'text-[var(--primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-[var(--accent-soft)] text-[var(--accent)] transform -translate-y-1' : ''}`}>
                  <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                </div>
                {active && (
                   <span className="absolute bottom-2 w-1 h-1 rounded-full bg-[var(--accent)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
