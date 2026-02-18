'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { 
  checkUserByPin, 
  createUser, 
  setCurrentUser, 
  getUserCount,
  isValidPin 
} from '@/lib/storage';

type LoginStep = 'pin' | 'register' | 'loading';

const MAX_USERS = 15;
const MIN_PIN = 1001;
const MAX_PIN = 1015;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('pin');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);

  // Cargar conteo de usuarios al montar el componente
  useEffect(() => {
    const loadUserCount = async () => {
      const count = await getUserCount();
      setUserCount(count);
    };
    loadUserCount();
  }, []);

  // Paso 1: Verificar PIN
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar formato del PIN
    if (!isValidPin(pin)) {
      setError(`PIN inválido. Debe ser un número entre ${MIN_PIN} y ${MAX_PIN}`);
      return;
    }

    setLoading(true);

    try {
      // Verificar si el PIN ya está registrado
      const existingUser = await checkUserByPin(pin);

      if (existingUser) {
        // PIN existe → Login normal
        setCurrentUser(existingUser);
        router.push('/dashboard');
      } else {
        // PIN nuevo → Ir a registro
        const count = await getUserCount();
        if (count >= MAX_USERS) {
          setError('Ya se alcanzó el límite máximo de 15 participantes');
          setLoading(false);
          return;
        }
        setUserCount(count);
        setStep('register');
        setLoading(false);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  // Paso 2: Crear cuenta con nombre
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar nombre
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Crear nuevo usuario
      const newUser = await createUser(pin, name.trim());

      if (newUser) {
        setCurrentUser(newUser);
        router.push('/dashboard');
      } else {
        setError('Error al crear la cuenta. Inténtalo de nuevo.');
        setLoading(false);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  // Volver al paso anterior
  const handleBack = () => {
    setStep('pin');
    setName('');
    setError('');
  };

  const remainingSlots = MAX_USERS - userCount;

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
          {step === 'pin' && (
            /* Paso 1: Ingresar PIN */
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingresa tu PIN
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all text-center text-lg tracking-widest"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <p className="text-xs text-gray-400 mt-2 text-center">
                  PINs válidos: {MIN_PIN} - {MAX_PIN}
                </p>
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
                {loading ? 'Verificando...' : 'Continuar'}
              </button>

              <p className="text-center text-gray-400 text-xs">
                {userCount} de {MAX_USERS} amigos registrados
              </p>
            </form>
          )}

          {step === 'register' && (
            /* Paso 2: Crear cuenta (PIN nuevo) */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  PIN: {pin} (nuevo)
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Cómo te llamas?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  maxLength={30}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                  required
                  autoFocus
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
                {loading ? 'Creando cuenta...' : 'Crear cuenta y entrar'}
              </button>

              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                Volver
              </button>

              <div className="text-center">
                <p className="text-xs text-amber-600">
                  ⚠️ Solo quedan {remainingSlots} lugar{remainingSlots !== 1 ? 'es' : ''} de {MAX_USERS}
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Ayuda */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Solo para participantes registrados
        </p>
      </div>
    </div>
  );
}
