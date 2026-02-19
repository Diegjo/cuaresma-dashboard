'use client';

import { Check, Clock } from 'lucide-react';

interface SocialUser {
  id: string;
  name: string;
  prayed_rosary: boolean;
  intention?: string;
}

interface SocialListProps {
  users: SocialUser[];
}

function PurposeText({ intention }: { intention?: string }) {
  const normalizedIntention = intention?.trim();

  if (normalizedIntention) {
    return (
      <p className="text-sm text-[var(--text-secondary)] mt-1 italic">
        "{normalizedIntention}"
      </p>
    );
  }

  return (
    <p className="text-xs text-[var(--text-tertiary)] mt-1">
      Sin propósito compartido
    </p>
  );
}

export function SocialList({ users }: SocialListProps) {
  const completed = users.filter(u => u.prayed_rosary);
  const pending = users.filter(u => !u.prayed_rosary);

  return (
    <div className="space-y-6">
      {/* Completed Section */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <Check size={16} className="text-green-500" />
          Completaron hoy ({completed.length})
        </h3>
        <div className="space-y-3">
          {completed.map(user => (
            <div key={user.id} className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-medium text-[var(--text)]">{user.name}</h4>
                <PurposeText intention={user.intention} />
              </div>
            </div>
          ))}
          {completed.length === 0 && (
            <p className="text-sm text-[var(--text-tertiary)] italic pl-2">Nadie ha completado aún.</p>
          )}
        </div>
      </div>

      {/* Pending Section */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <Clock size={16} className="text-orange-500" />
          Pendientes ({pending.length})
        </h3>
        <div className="space-y-3">
          {pending.map(user => (
            <div key={user.id} className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] flex items-center gap-3 opacity-75">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-tertiary)] font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-medium text-[var(--text-secondary)]">{user.name}</h4>
                <PurposeText intention={user.intention} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
