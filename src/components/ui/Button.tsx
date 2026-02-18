'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

export function Button({
  className = '',
  children,
  variant = 'primary',
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
}) {
  const base =
    'pressable inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed';

  const styles: Record<Variant, string> = {
    primary:
      'bg-[var(--color-accent)] text-white shadow-[0_8px_24px_rgba(0,122,255,0.25)] hover:brightness-95',
    secondary:
      'bg-[#EDEDF0] text-[var(--color-text)] hover:bg-[#E5E5EA]',
    ghost: 'bg-transparent text-[var(--color-accent)] hover:bg-black/5',
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {loading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}
