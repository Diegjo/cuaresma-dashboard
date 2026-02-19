'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Home, Calendar, Users } from 'lucide-react';
import { Suspense } from 'react';

function BottomNavContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'home';

  const tabs = [
    { id: 'home', label: 'Hoy', icon: Home, href: '/dashboard?tab=home' },
    { id: 'calendar', label: 'Calendario', icon: Calendar, href: '/dashboard?tab=calendar' },
    { id: 'social', label: 'Grupo', icon: Users, href: '/dashboard?tab=social' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-6">
      <div className="mx-auto max-w-[430px] px-6 pointer-events-auto">
        <div className="rounded-full bg-[var(--surface)]/90 backdrop-blur-xl border border-[var(--border)] shadow-lg flex justify-around items-center h-16 relative">
          {tabs.map((t) => {
            const active = currentTab === t.id;
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                href={t.href}
                className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                  active ? 'text-[var(--primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-[var(--primary)]/10 text-[var(--primary)] -translate-y-1' : ''}`}>
                  <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                </div>
                {active && (
                   <span className="absolute bottom-2 w-1 h-1 rounded-full bg-[var(--primary)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function BottomNav() {
  return (
    <Suspense fallback={<div className="h-16" />}>
      <BottomNavContent />
    </Suspense>
  );
}
