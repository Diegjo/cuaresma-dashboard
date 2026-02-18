import React from 'react';

export function Card({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-[var(--color-surface)] rounded-2xl border border-black/5 shadow-[var(--shadow)] ${className}`}
    >
      {children}
    </div>
  );
}
