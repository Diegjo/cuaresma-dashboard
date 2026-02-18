import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reto de Cuaresma',
  description: 'Dashboard de 40 días de retos espirituales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
