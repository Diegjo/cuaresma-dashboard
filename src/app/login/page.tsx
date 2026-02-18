'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { loginUser, setCurrentUser } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Buscar usuario en Supabase
      const user = await loginUser(name, pin);

      if (user) {
        setCurrentUser(user);
        router.push('/dashboard');
      } else {
        setError('Nombre o PIN incorrectos');
        setLoading(false);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fadeIn">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📿</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {CONFIG.appName}
          </h1>
          <p className="text-gray-500 text-sm">
            40 días · 15 amigos · 7 hábitos
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Ayuda */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Solo para participantes registrados
        </p>
      </div>
    </div>
  );
}
