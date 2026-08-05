import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-12">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-3 lg:space-y-4">
        {/* Links */}
        <div className="flex items-center justify-center gap-4 text-[13px] text-muted-foreground/60">
          <Link href="/help" className="hover:text-foreground transition-colors">帮助中心</Link>
          <span className="text-border/40">|</span>
          <Link href="/join" className="hover:text-foreground transition-colors">加入我们</Link>
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
            © 2026 泛天 · @公 &nbsp;|&nbsp; QQ群：1083464126 &nbsp;|&nbsp; QQ：2654868812
          </p>
        </div>

        {/* Dev thanks */}
        <div className="flex items-center justify-center gap-2">
          <a
            href="https://scm.flowcld.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 transition-opacity hover:opacity-80"
          >
            <img src="/scm-logo.jpg" alt="SCM" className="h-6 object-contain" />
          </a>
          <p className="text-[11px] text-muted-foreground/50">
            本网站开发者是 SCM 开发组一员，非常感谢 SCM 开发组 @Rookie 和 @Starryeye 大佬对本网站开发提供的支持
          </p>
        </div>

        {/* Data credits */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="text-[11px] text-muted-foreground/50">感谢星际公民汉化盒子提供的中英对照支持</span>
          <a
            href="https://apps.microsoft.com/detail/9nf3swfwnkl1?launch=false&mode=mini&hl=zh-CN&gl=CN"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-100"
          >
            <img
              src="/hanhua-logo.png"
              alt="汉化盒子"
              className="h-7 object-contain opacity-75 hover:opacity-100"
            />
          </a>
          <span className="text-border/40">|</span>
          <span className="text-[11px] text-muted-foreground/50">感谢UEX提供的数据</span>
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

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-muted-foreground/40">
          泛天非官方工具，与Cloud Imperium Group无任何关联
        </p>
      </div>
    </footer>
  );
}
