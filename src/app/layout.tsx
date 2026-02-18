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
      <body className="min-h-screen bg-[#F5F5F7]">
        <div className="min-h-screen">
          <div className="mx-auto min-h-screen max-w-[430px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
