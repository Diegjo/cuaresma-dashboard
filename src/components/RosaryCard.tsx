'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Youtube } from 'lucide-react';

interface RosaryData {
  mystery: string;
  mysteries: string[];
  mp3Link?: string;
  youtubeLink?: string;
}

export function RosaryCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<RosaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rosary/today')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-24 bg-[var(--surface)] rounded-2xl animate-pulse" />;

  return (
    <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-sm border border-[var(--border)] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--habit-7-icon-bg)] flex items-center justify-center text-xl">
            📿
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-[var(--text)]">Misterios de hoy</h3>
            <p className="text-sm text-[var(--text-secondary)]">{data?.mystery}</p>
          </div>
        </div>
        <ChevronDown 
          className={`text-[var(--text-tertiary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              <ul className="space-y-2">
                {data?.mysteries.map((m, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] pl-2 border-l-2 border-[var(--border)]">
                    {m}
                  </li>
                ))}
              </ul>

              <div className="flex gap-3 pt-2">
                <a 
                  href="https://www.youtube.com/@RosarioCorto675/videos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[var(--bg-subtle)] hover:bg-[var(--border)] py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Play size={16} /> Escuchar
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
