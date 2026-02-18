'use client';

import { motion } from 'framer-motion';
import { Trophy, Flame, Target } from 'lucide-react';

interface StatsGridProps {
  progress: number; // 0 to 1
  completedCount: number;
  totalHabits: number;
  streak: number;
  totalPoints: number;
}

export function StatsGrid({
  progress,
  completedCount,
  totalHabits,
  streak,
  totalPoints,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {/* Daily Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1 bg-white p-4 rounded-2xl shadow-sm border border-[var(--border)] flex flex-col justify-between h-[150px] relative overflow-hidden group"
      >
        <div className="flex justify-between items-start z-10">
          <div className="bg-[var(--accent-soft)] p-2 rounded-xl group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold tracking-tight text-[var(--text)]">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
        
        <div className="mt-auto z-10 space-y-2">
          <div>
            <p className="text-[13px] font-medium text-[var(--text-secondary)]">
              Progreso Diario
            </p>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              {completedCount} de {totalHabits} hábitos
            </p>
          </div>
          {/* Mini Progress Bar */}
          <div className="h-1.5 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--accent)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Streak & Points Column */}
      <div className="col-span-1 flex flex-col gap-3 h-[150px]">
        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-[var(--border)] flex items-center gap-3 relative overflow-hidden"
        >
          <div className="bg-[var(--warning-soft)] p-2.5 rounded-xl shrink-0 z-10">
            <Flame className="w-5 h-5 text-[var(--warning)]" />
          </div>
          <div className="z-10">
            <div className="text-xl font-bold text-[var(--text)]">{streak}</div>
            <div className="text-[11px] font-medium text-[var(--text-secondary)] leading-none">
              Días Racha
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] text-[var(--warning)] pointer-events-none">
            <Flame className="w-24 h-24" />
          </div>
        </motion.div>

        {/* Points/Total Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-[var(--border)] flex items-center gap-3 relative overflow-hidden"
        >
          <div className="bg-[var(--success-soft)] p-2.5 rounded-xl shrink-0 z-10">
            <Trophy className="w-5 h-5 text-[var(--success)]" />
          </div>
          <div className="z-10">
            <div className="text-xl font-bold text-[var(--text)]">{totalPoints}</div>
             <div className="text-[11px] font-medium text-[var(--text-secondary)] leading-none">
              Puntos Total
            </div>
          </div>
          {/* Decorative background element */}
           <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] text-[var(--success)] pointer-events-none">
            <Trophy className="w-24 h-24" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
