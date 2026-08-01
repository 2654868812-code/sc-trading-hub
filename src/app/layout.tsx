import type { Metadata } from 'next';
import Link from 'next/link';
import { Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import { NavHeader } from '@/components/NavHeader';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto',
});

export const metadata: Metadata = {
  title: '泛天贸易',
  description: '星际公民交易数据平台',
  icons: { icon: '/logo-square.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSans.variable} min-h-screen bg-background text-foreground antialiased`}>
        <header className="bg-card">
          <div className="px-6 py-4 flex items-center gap-6">
            <Link href="/" className="flex items-baseline gap-2.5 shrink-0">
              <h1 className="logo-serif text-[28px] font-bold tracking-tighter leading-none text-primary">
                泛天
              </h1>
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
                Trading Hub
              </span>
            </Link>
            <NavHeader />
          </div>
          <div className="gold-shimmer-line" />
        </header>
        <main className="max-w-[1280px] mx-auto px-6 py-4">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer />
      </body>
    </html>
  );
}
