'use client';

import { useState } from 'react';
import { format, eachDayOfInterval, isSameDay, isAfter, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Checkin {
  date: string;
  prayed_rosary: boolean;
  intention?: string;
}

interface CalendarGridProps {
  startDate: Date;
  endDate: Date;
  checkins: Checkin[];
}

export function CalendarGrid({ startDate, endDate, checkins }: CalendarGridProps) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const today = startOfDay(new Date());

  const getCheckin = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return checkins.find(c => c.date === dateStr);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-[var(--text-tertiary)] py-2">
            {d}
          </div>
        ))}
        
        {/* Empty cells for offset. Feb 18 2026 is Wednesday. So we need 3 empty cells (Sun, Mon, Tue). */}
        {Array.from({ length: days[0].getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day, i) => {
          const checkin = getCheckin(day);
          const isToday = isSameDay(day, today);
          const isFuture = isAfter(day, today);
          const hasIntention = checkin?.intention;
          
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(day)}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center relative border transition-colors
                ${isToday ? 'ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--bg-subtle)]' : ''}
                ${checkin?.prayed_rosary 
                  ? 'bg-[var(--habit-7-icon-bg)] border-transparent text-[var(--primary)]' 
                  : isFuture 
                    ? 'bg-transparent border-transparent text-[var(--text-tertiary)] opacity-50'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)]'
                }
              `}
            >
              <span className="text-xs font-medium">{format(day, 'd')}</span>
              {checkin?.prayed_rosary && <Check size={14} className="mt-1" />}
              {hasIntention && !checkin?.prayed_rosary && (
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1" />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-[var(--text)]">
                {format(selectedDay, "EEEE d 'de' MMMM", { locale: es })}
              </h4>
              <button 
                onClick={() => setSelectedDay(null)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text)]"
              >
                <X size={16} />
              </button>
            </div>
            
            {getCheckin(selectedDay)?.intention ? (
              <p className="text-sm text-[var(--text-secondary)] italic">
                "{getCheckin(selectedDay)?.intention}"
              </p>
            ) : (
              <p className="text-sm text-[var(--text-tertiary)]">
                Sin propósito registrado.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
