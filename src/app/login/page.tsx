'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CONFIG } from '@/lib/config';
import {
  checkUserByPin,
  createUser,
  setCurrentUser,
  getUserCount,
  isValidPin,
} from '@/lib/storage';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type LoginStep = 'pin' | 'register';

const MAX_USERS = 15;
const MIN_PIN = 1001;
const MAX_PIN = 1015;

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed left-0 right-0 top-3 z-50 px-4">
      <div className="mx-auto max-w-md">
        <div className="animate-toastIn rounded-2xl bg-white/90 px-4 py-3 text-sm text-[var(--color-text)] shadow-[var(--shadow)] backdrop-blur-xl border border-black/10">
          {message}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('pin');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    getUserCount().then(setUserCount);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const remainingSlots = MAX_USERS - userCount;

  const pinHelp = useMemo(() => `Ingresa tu PIN (${MIN_PIN}-${MAX_PIN})`, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast('');

    if (!isValidPin(pin)) {
      setShake(true);
      setTimeout(() => setShake(false), 350);
      setToast(`PIN inválido. Debe ser un número entre ${MIN_PIN} y ${MAX_PIN}.`);
      return;
    }

    setLoading(true);

    try {
      const existingUser = await checkUserByPin(pin);
      if (existingUser) {
        setCurrentUser(existingUser);
        router.push('/dashboard');
        return;
      }

      const count = await getUserCount();
      if (count >= MAX_USERS) {
        setToast('Ya se alcanzó el límite máximo de 15 participantes.');
        setLoading(false);
        return;
      }

      setUserCount(count);
      setStep('register');
      setLoading(false);
    } catch {
      setToast('Error al conectar con el servidor.');
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast('');

    if (!name.trim() || name.trim().length < 2) {
      setToast('Ingresa tu nombre (mínimo 2 caracteres).');
      return;
    }

    setLoading(true);
    try {
      const newUser = await createUser(pin, name.trim());
      if (!newUser) {
        setToast('Error al crear la cuenta. Inténtalo de nuevo.');
        setLoading(false);
        return;
      }
      setCurrentUser(newUser);
      router.push('/dashboard');
    } catch {
      setToast('Error al conectar con el servidor.');
      setLoading(false);
    }
  };

  const back = () => {
    setStep('pin');
    setName('');
    setToast('');
  };

  return (
    <div className="min-h-screen px-4 py-10 flex items-center">
      <Toast message={toast} />

      <div className="w-full">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-[var(--shadow)]">
            <span className="text-3xl">🙏</span>
          </div>
          <h1 className="ios-title text-2xl font-semibold text-[var(--color-text)]">
            {CONFIG.appName}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Bienvenido</p>
        </div>

        <div className="mt-8">
          <Card className="p-5">
            <AnimatePresence mode="wait">
              {step === 'pin' ? (
                <motion.form
                  key="pin"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handlePinSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium text-[var(--color-text)]">PIN</label>
                    <div className={`mt-2 ${shake ? 'animate-shake' : ''}`}>
                      <Input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder={pinHelp}
                        maxLength={4}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="text-center text-lg tracking-widest"
                        autoFocus
                      />
                    </div>
                    <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
                      PINs válidos: {MIN_PIN} – {MAX_PIN}
                    </p>
                  </div>

                  <Button type="submit" className="w-full" loading={loading} disabled={loading}>
                    Continuar
                  </Button>

                  <p className="text-center text-xs text-[var(--color-text-muted)]">
                    {userCount} de {MAX_USERS} registrados
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-sm text-[var(--color-text-muted)]">
                      PIN: <span className="ml-1 font-semibold text-[var(--color-text)]">{pin}</span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                      Ingresa tu nombre para registrarte
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--color-text)]">Nombre</label>
                    <div className="mt-2">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        maxLength={30}
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" loading={loading} disabled={loading}>
                    Crear cuenta y entrar
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={back}
                    disabled={loading}
                  >
                    Volver
                  </Button>

                  <p className="text-center text-xs text-[var(--color-text-muted)]">
                    {remainingSlots} de {MAX_USERS} lugares disponibles
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>

          <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
            Solo para participantes registrados
          </p>
        </div>
      </div>
    </div>
  );
}
