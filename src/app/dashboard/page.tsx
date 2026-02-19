'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LogOut, Calendar as CalendarIcon, Check, Flame, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { RosaryCard } from '@/components/RosaryCard';
import { PurposeCard } from '@/components/PurposeCard';
import { CalendarGrid } from '@/components/CalendarGrid';
import { SocialList } from '@/components/SocialList';
import { BottomNav } from '@/components/BottomNav';
import { ThemeToggle } from '@/components/ThemeToggle';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'home';
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [todayCheckin, setTodayCheckin] = useState<any>(null);
  const [allCheckins, setAllCheckins] = useState<any[]>([]);
  const [socialData, setSocialData] = useState<any[]>([]);
  const [lentRange, setLentRange] = useState<any>(null);
  const [stats, setStats] = useState({ streak: 0, totalDays: 0 });

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);
      
      // Load initial data
      await Promise.all([
        loadCheckin(user.id),
        loadLentRange(),
        loadStats(user.id)
      ]);
      
      setLoading(false);
    };
    
    checkUser();
  }, [router, supabase]);

  // Load data when tab changes
  useEffect(() => {
    if (!user) return;
    
    if (currentTab === 'calendar') {
      loadAllCheckins(user.id);
    } else if (currentTab === 'social') {
      loadSocialData();
    }
  }, [currentTab, user]);

  const loadCheckin = async (userId: string) => {
    try {
      const res = await fetch(`/api/checkins?date=${todayStr}`);
      if (res.ok) {
        const data = await res.json();
        setTodayCheckin(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadAllCheckins = async (userId: string) => {
    try {
      const res = await fetch('/api/checkins?all=true');
      if (res.ok) {
        setAllCheckins(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadSocialData = async () => {
    try {
      const res = await fetch(`/api/social?date=${todayStr}`);
      if (res.ok) {
        setSocialData(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadLentRange = async () => {
    const res = await fetch('/api/lent/range');
    if (res.ok) setLentRange(await res.json());
  };
  
  const loadStats = async (userId: string) => {
    try {
      const res = await fetch('/api/checkins?all=true');
      if (res.ok) {
        const data = await res.json();
        const completed = data.filter((c: any) => c.prayed_rosary);
        
        // Calculate streak
        let streak = 0;
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const hasToday = completed.some((c: any) => c.date === todayStr);
        let currentCheckDate = new Date(today);
        
        if (!hasToday) {
           currentCheckDate.setDate(currentCheckDate.getDate() - 1);
        }
        
        while (true) {
          const checkStr = format(currentCheckDate, 'yyyy-MM-dd');
          const hasEntry = completed.some((c: any) => c.date === checkStr);
          if (hasEntry) {
            streak++;
            currentCheckDate.setDate(currentCheckDate.getDate() - 1);
          } else {
            break;
          }
        }
        
        setStats({
          streak: streak,
          totalDays: completed.length
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRosaryToggle = async () => {
    const newVal = !todayCheckin?.prayed_rosary;
    
    // Optimistic UI
    const prevCheckin = todayCheckin;
    setTodayCheckin((prev: any) => ({ ...prev, prayed_rosary: newVal }));

    if (newVal) {
      toast.success('¡Rosario completado!');
    } else {
      toast('Rosario desmarcado');
    }

    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date: todayStr,
          prayedRosary: newVal 
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al guardar');
      }
      
      const data = await res.json();
      setTodayCheckin(data);
      loadStats(user.id);
    } catch (e: any) {
      console.error(e);
      setTodayCheckin(prevCheckin);
      toast.error(e.message || 'Error al guardar');
    }
  };

  const handlePurposeSave = async (text: string) => {
    const res = await fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        date: todayStr,
        intention: text 
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      setTodayCheckin(data);
      toast.success('Propósito guardado');
    } else {
      const errorData = await res.json().catch(() => ({}));
      toast.error(errorData.error || 'Error al guardar propósito');
      throw new Error(errorData.error || 'Failed to save');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-subtle)]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-[var(--bg-subtle)]">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-[var(--bg-subtle)] sticky top-0 z-20 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#18181B] text-white flex items-center justify-center font-bold text-lg">
              {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-bold text-[var(--text)] leading-tight">
                {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}
              </h1>
              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <Flame size={12} className="text-orange-500" />
                  {stats.streak} días racha
                </span>
                <span className="flex items-center gap-1">
                  <Trophy size={12} className="text-yellow-500" />
                  {stats.totalDays} total
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="h-10 w-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)]"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <RosaryCard />

              <button
                onClick={handleRosaryToggle}
                className={`
                  w-full p-6 rounded-2xl border transition-all duration-300 flex items-center gap-4 group
                  ${todayCheckin?.prayed_rosary 
                    ? 'bg-[var(--primary)] border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20' 
                    : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]'
                  }
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
                  ${todayCheckin?.prayed_rosary 
                    ? 'bg-[var(--primary-foreground)] border-[var(--primary-foreground)] text-[var(--primary)]' 
                    : 'border-[var(--text-tertiary)] group-hover:border-[var(--primary)]'
                  }
                `}>
                  {todayCheckin?.prayed_rosary && <Check size={16} strokeWidth={3} />}
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-lg ${todayCheckin?.prayed_rosary ? 'text-[var(--primary-foreground)]' : 'text-[var(--text)]'}`}>
                    {todayCheckin?.prayed_rosary ? '¡Rosario completado!' : 'Marcar rosario de hoy'}
                  </h3>
                  {!todayCheckin?.prayed_rosary && (
                    <p className="text-sm text-[var(--text-secondary)]">Toca aquí cuando termines de rezar</p>
                  )}
                </div>
              </button>

              <PurposeCard 
                initialPurpose={todayCheckin?.intention} 
                onSave={handlePurposeSave} 
              />
            </motion.div>
          )}

          {currentTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Progreso Cuaresma</span>
                  <span className="font-bold text-[var(--primary)]">
                    {Math.round((stats.totalDays / 43) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                    style={{ width: `${(stats.totalDays / 43) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-2 text-center">
                  {stats.totalDays} de 43 días completados
                </p>
              </div>

              {lentRange && (
                <CalendarGrid 
                  startDate={new Date(lentRange.start)} 
                  endDate={new Date(lentRange.end)} 
                  checkins={allCheckins} 
                />
              )}
            </motion.div>
          )}

          {currentTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-[var(--text)]">Grupo</h2>
                <div className="text-sm text-[var(--text-secondary)] bg-[var(--surface)] px-3 py-1 rounded-full border border-[var(--border)]">
                  {socialData.filter(u => u.prayed_rosary).length} / {socialData.length} completaron
                </div>
              </div>
              
              <SocialList users={socialData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-subtle)]" />}>
      <DashboardContent />
    </Suspense>
  );
}
