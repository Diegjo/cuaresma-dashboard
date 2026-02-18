import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

// Cliente de Supabase
export const supabase = createClient(
  CONFIG.supabase.url || 'https://placeholder.supabase.co',
  CONFIG.supabase.anonKey || 'placeholder-key'
);

// LocalStorage keys
const STORAGE_KEYS = {
  currentUser: 'cuaresma_user',
  entries: 'cuaresma_entries',
};

// ====== USUARIOS ======

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(STORAGE_KEYS.currentUser);
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
}

export function clearCurrentUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.currentUser);
}

// ====== ENTRADAS DIARIAS ======

export function getEntries(): any[] {
  if (typeof window === 'undefined') return [];
  const entries = localStorage.getItem(STORAGE_KEYS.entries);
  return entries ? JSON.parse(entries) : [];
}

export function saveEntry(entry: any) {
  if (typeof window === 'undefined') return;
  const entries = getEntries();
  const existingIndex = entries.findIndex(
    (e) => e.userId === entry.userId && e.date === entry.date
  );
  
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push({ ...entry, id: `${entry.userId}-${entry.date}` });
  }
  
  localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
}

export function getUserEntries(userId: string): any[] {
  return getEntries().filter((e) => e.userId === userId);
}

export function getEntryForDate(userId: string, date: string): any | null {
  return getEntries().find((e) => e.userId === userId && e.date === date) || null;
}

// ====== CALCULOS ======

export function calculateTotalPoints(userId: string): number {
  const entries = getUserEntries(userId);
  return entries.reduce((sum, entry) => sum + (entry.totalPoints || 0), 0);
}

export function calculateCurrentStreak(userId: string): number {
  const entries = getUserEntries(userId)
    .filter((e) => e.totalPoints > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (entries.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < entries.length; i++) {
    const entryDate = new Date(entries[i].date);
    entryDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }
  
  return streak;
}

// ====== LEADERBOARD ======

export function getLeaderboard(users: any[]) {
  return users
    .map((user) => ({
      ...user,
      totalPoints: calculateTotalPoints(user.id),
      currentStreak: calculateCurrentStreak(user.id),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);
}
