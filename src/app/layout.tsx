import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reto de Cuaresma - Finders',
  description: 'Dashboard de 40 días de retos espirituales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased`}>
        <div className="min-h-screen flex justify-center bg-[var(--bg-subtle)]">
          <div className="w-full max-w-[480px] min-h-screen bg-[var(--bg)] shadow-xl relative">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
