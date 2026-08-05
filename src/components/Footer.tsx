import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-12">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-3 lg:space-y-4">
        {/* Links */}
        <div className="flex items-center justify-center gap-4 text-[13px] text-muted-foreground/60">
          <Link href="/help" className="hover:text-foreground transition-colors">帮助中心</Link>
        </div>

        {/* Copyright */}
        <div className="flex items-center justify-center gap-3">
          <p className="text-[11px] text-muted-foreground/40">
            © 2026 泛天数据展示 · 个人技术实践站点
          </p>
        </div>

        {/* Data credits */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="text-[11px] text-muted-foreground/50">数据来源：公开数据接口</span>
          <a
            href="https://uexcorp.space"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/uex-badge.png"
              alt="Powered by UEX"
              className="h-7 object-contain"
            />
          </a>
        </div>

        {/* ICP placeholder */}
        <p className="text-center text-[11px] text-muted-foreground/40">
          本网站为个人技术实践项目，不含商业运营与用户交互功能
        </p>
      </div>
    </footer>
  );
}
