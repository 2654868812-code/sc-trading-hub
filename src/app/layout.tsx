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
        <header className="border-b-2 border-border bg-card">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="泛天贸易"
              width={48}
              height={48}
              className="rounded"
            />
            <h1 className="text-2xl font-bold tracking-tight">泛天贸易</h1>
          </div>
        </header>
        <main className="px-6 py-4">{children}</main>
      </body>
    </html>
  );
}
