import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';

export const metadata: Metadata = {
  title: '泛天贸易',
  description: '星际公民交易数据平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="border-b border-border bg-card">
          <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="泛天贸易"
              width={36}
              height={36}
              className="rounded"
            />
            <h1 className="text-xl font-bold tracking-tight">泛天贸易</h1>
          </div>
        </header>
        <main className="px-6 py-4">{children}</main>
      </body>
    </html>
  );
}
