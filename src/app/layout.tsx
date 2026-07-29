import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SC Trading Hub',
  description: 'Star Citizen commodity trading dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="border-b border-border px-6 py-3">
          <h1 className="text-xl font-bold tracking-tight">SC Trading Hub</h1>
        </header>
        <main className="px-6 py-4">{children}</main>
      </body>
    </html>
  );
}
