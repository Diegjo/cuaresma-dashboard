'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface PurposeCardProps {
  initialPurpose?: string | null;
  onSave: (text: string) => Promise<void>;
}

export function PurposeCard({ initialPurpose = '', onSave }: PurposeCardProps) {
  const normalizedInitialPurpose = initialPurpose ?? '';
  const [purpose, setPurpose] = useState<string>(normalizedInitialPurpose);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Update local state if prop changes (e.g. initial load)
  useEffect(() => {
    if (!dirty) {
      setPurpose(normalizedInitialPurpose);
    }
  }, [normalizedInitialPurpose, dirty]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 160) {
      setPurpose(val);
      setDirty(true);
    }
  };

  const handleManualSave = async () => {
    if (!dirty) return;
    
    setSaving(true);
    try {
      await onSave(purpose);
      setDirty(false);
    } catch (error) {
      console.error('Failed to save purpose:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-sm border border-[var(--border)]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-[var(--text)]">Propósito personal de hoy</h3>
        <span className={`text-xs ${purpose.length > 140 ? 'text-red-500' : 'text-[var(--text-tertiary)]'}`}>
          {purpose.length}/160
        </span>
      </div>
      
      <div className="relative">
        <textarea
          value={purpose}
          onChange={handleChange}
          placeholder="Ej: Paciencia con X, cero refresco, levantarme a las 6..."
          className="w-full bg-[var(--bg-subtle)] rounded-xl p-3 text-sm text-[var(--text)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[80px] resize-none transition-shadow mb-3"
        />
        
        <div className="flex justify-end">
          <button
            onClick={handleManualSave}
            disabled={!dirty || saving}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${!dirty 
                ? 'bg-[var(--bg-subtle)] text-[var(--text-tertiary)] cursor-not-allowed' 
                : 'bg-[var(--primary)] text-white hover:bg-[var(--text)] shadow-md'
              }
            `}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
