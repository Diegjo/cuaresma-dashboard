'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('¡Bienvenido de nuevo!');
        router.push('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (error) throw error;
        toast.success('Cuenta creada. Por favor inicia sesión.');
        setIsLogin(true);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-5 py-10 flex items-center justify-center bg-[var(--bg-subtle)]">
      <div className="w-full max-w-[430px] space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[var(--surface)] shadow-sm border border-[var(--border)]">
            <span className="text-[48px] leading-none">✝️</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Reto de Cuaresma - Finders</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-[var(--text)]">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full h-12 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                required
              />
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-[var(--text)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-12 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full h-12 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[var(--primary)] text-white font-semibold shadow-lg shadow-[var(--primary)]/20 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Registrarse')}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
