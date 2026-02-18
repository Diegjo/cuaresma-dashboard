'use client';

import { Check } from 'lucide-react';

export function LargeCheckbox({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label={ariaLabel ?? 'Marcar'}
      className="h-11 w-11 inline-flex items-center justify-center rounded-xl"
    >
      <span
        className={
          'h-8 w-8 rounded-[10px] border-2 flex items-center justify-center transition-colors ' +
          (checked
            ? 'bg-[var(--color-success)] border-[var(--color-success)]'
            : 'bg-transparent border-[#C7C7CC]')
        }
      >
        <Check
          size={18}
          className={checked ? 'text-white' : 'text-transparent'}
          strokeWidth={3}
        />
      </span>
    </button>
  );
}
