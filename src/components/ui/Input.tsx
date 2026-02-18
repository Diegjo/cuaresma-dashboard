'use client';

import React from 'react';

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl bg-[#F2F2F7] px-4 py-3 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-[var(--color-accent)] ${className}`}
      {...props}
    />
  );
}
