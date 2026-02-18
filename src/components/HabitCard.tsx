'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function HabitCard({
  title,
  subtitle,
  emoji,
  background, // Kept for API compatibility, used as accent color
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
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`
        w-full group relative overflow-hidden rounded-2xl border transition-all duration-300
        ${checked 
          ? 'bg-[var(--surface-subtle)] border-[var(--accent)]/30 shadow-none' 
          : 'bg-[var(--surface)] border-[var(--border)] shadow-sm hover:border-[var(--border-hover)] hover:shadow-md'
        }
      `}
    >
      <div className="flex items-center p-4 gap-4">
        {/* Icon Container */}
        <div 
          className={`
            h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all duration-300
            ${checked ? 'opacity-50 grayscale' : 'opacity-100'}
          `}
          style={{ background: iconBackground }}
        >
          {emoji}
        </div>

        {/* Text Content */}
        <div className="flex-1 text-left min-w-0">
          <h3 className={`
            text-[16px] font-semibold truncate transition-colors duration-300
            ${checked ? 'text-[var(--text-tertiary)] line-through' : 'text-[var(--text)]'}
          `}>
            {title}
          </h3>
          <p className={`
            text-[13px] truncate transition-colors duration-300
            ${checked ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-secondary)]'}
          `}>
            {subtitle}
          </p>
        </div>

        {/* Custom Checkbox */}
        <div className={`
          h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0
          ${checked 
            ? 'bg-[var(--accent)] border-[var(--accent)] scale-110' 
            : 'border-[var(--text-tertiary)] bg-transparent group-hover:border-[var(--accent)]'
          }
        `}>
          <Check 
            size={16} 
            className={`
              transition-all duration-300 font-bold
              ${checked ? 'text-white scale-100' : 'text-transparent scale-0'}
            `}
            strokeWidth={3}
          />
        </div>
      </div>
      
      {/* Progress Line (Optional visual cue) */}
      <div className={`absolute bottom-0 left-0 h-[2px] bg-[var(--accent)] transition-all duration-500 ${checked ? 'w-full' : 'w-0'}`} />
    </motion.button>
  );
}
