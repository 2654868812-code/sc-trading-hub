import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-12">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-4">
        {/* Links */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground/60">
          <Link href="/help" className="hover:text-foreground transition-colors">帮助</Link>
          <Link href="/join" className="hover:text-foreground transition-colors">加入我们</Link>
          <Link href="/reports" className="hover:text-foreground transition-colors">泛天商报</Link>
        </div>

        {/* Copyright + logo */}
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://robertsspaceindustries.com/en/orgs/FANTIAN"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <img src="/logo.png" alt="泛天商会" className="h-10 object-contain opacity-75" />
          </a>
          <p className="text-[11px] text-muted-foreground/40">
            © 2026 泛天贸易 · @公 &nbsp;|&nbsp; QQ群：1083464126 &nbsp;|&nbsp; QQ：2654868812
          </p>
        </div>

        {/* UEX credit */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-[11px] text-muted-foreground/60">技术支持</span>
          <a
            href="https://uexcorp.space"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/uex-badge.png"
              alt="Powered by UEX"
              className="h-8 object-contain"
            />
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-muted-foreground/40">
          泛天贸易为非官方工具，游戏数据来自{' '}
          <a href="https://uexcorp.space" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors">
            UEX Corp
          </a>
          {' '}公开 API
        </p>
      </div>
    </footer>
  );
}
