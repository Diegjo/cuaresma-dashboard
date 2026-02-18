'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import {
  getCurrentUser,
  clearCurrentUser,
  getLeaderboard,
  LeaderboardEntry,
  User,
} from '@/lib/storage';

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadLeaderboard();
  }, [router]);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await getLeaderboard();
    setLeaderboard(data);
    setLoading(false);
  };

  const handleLogout = () => {
    clearCurrentUser();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-900">Leaderboard</h1>
            <p className="text-xs text-gray-500">
              {leaderboard.length} participantes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="text-sm text-violet-600 hover:text-violet-700 font-medium"
            >
              Mi progreso
            </a>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : (
          <>
            {/* Podio */}
            {leaderboard.length >= 3 && (
              <div className="flex items-end justify-center gap-2 mb-6 pt-4">
                {/* 2do lugar */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl mb-2">
                    🥈
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-3 w-24 text-center">
                    <div className="font-semibold text-sm truncate">
                      {leaderboard[1].name}
                    </div>
                    <div className="text-lg font-bold text-gray-700">
                      {leaderboard[1].total_points}
                    </div>
                    <div className="text-xs text-orange-500">
                      🔥 {leaderboard[1].current_streak}
                    </div>
                  </div>
                </div>

                {/* 1er lugar */}
                <div className="flex flex-col items-center -mt-4">
                  <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-3xl mb-2 border-4 border-yellow-300">
                    🥇
                  </div>
                  <div className="bg-violet-600 rounded-xl border border-violet-600 p-4 w-28 text-center text-white">
                    <div className="font-semibold text-sm truncate">
                      {leaderboard[0].name}
                    </div>
                    <div className="text-2xl font-bold">{leaderboard[0].total_points}</div>
                    <div className="text-xs text-violet-200">
                      🔥 {leaderboard[0].current_streak}
                    </div>
                  </div>
                </div>

                {/* 3er lugar */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl mb-2">
                    🥉
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-3 w-24 text-center">
                    <div className="font-semibold text-sm truncate">
                      {leaderboard[2].name}
                    </div>
                    <div className="text-lg font-bold text-gray-700">
                      {leaderboard[2].total_points}
                    </div>
                    <div className="text-xs text-orange-500">
                      🔥 {leaderboard[2].current_streak}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lista completa */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-8">#</span>
                  <span className="flex-1">Participante</span>
                  <span className="w-16 text-center">Puntos</span>
                  <span className="w-12 text-center">Racha</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {leaderboard.map((participant, index) => (
                  <div
                    key={participant.id}
                    className={`p-4 flex items-center ${
                      participant.id === user.id ? 'bg-violet-50' : ''
                    }`}
                  >
                    <span className="w-8 text-sm font-medium text-gray-500">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {participant.name}
                        {participant.id === user.id && (
                          <span className="ml-2 text-xs bg-violet-200 text-violet-700 px-2 py-0.5 rounded-full">
                            Tú
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="w-16 text-center font-semibold text-gray-900">
                      {participant.total_points}
                    </span>
                    <span className="w-12 text-center text-sm text-orange-500">
                      {participant.current_streak > 0
                        ? `🔥 ${participant.current_streak}`
                        : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leyenda */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Actualizado en tiempo real desde la base de datos
            </p>
          </>
        )}
      </main>
    </div>
  );
}
