import type { Metadata } from 'next';
import Link from 'next/link';
import { Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import { NavHeader } from '@/components/NavHeader';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SearchFloat } from '@/components/SearchFloat';

const DESIGN_W = 1280;

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
        <script
          dangerouslySetInnerHTML={{
            __html: '(function(){var s=document.createElement("style");s.id="vpz";var d='+DESIGN_W+',m=1024;function z(){var w=innerWidth;s.textContent="html{zoom:"+(w<d&&w>=m?w/d:1)+"}";}s.textContent="html{zoom:1}";document.head.appendChild(s);z();addEventListener("resize",z);})()',
          }}
        />
        <header className="bg-card">
          <div className="max-w-[1280px] px-3 sm:px-4 lg:px-6 py-2 lg:py-4 flex items-center gap-1.5 sm:gap-4 lg:gap-6 overflow-x-auto">
            <Link href="/" className="flex items-baseline gap-2 lg:gap-2.5 shrink-0">
              <h1 className="logo-serif text-[20px] sm:text-[26px] lg:text-[28px] font-bold tracking-tighter leading-none text-primary">
                泛天
              </h1>
              <span className="text-[7px] sm:text-[9px] lg:text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
                Trading Hub
              </span>
            </Link>
            <NavHeader />
          </div>
          <div className="gold-shimmer-line" />
        </header>
        <main className="max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer />
        <SearchFloat />
      </body>
    </html>
  );
}
