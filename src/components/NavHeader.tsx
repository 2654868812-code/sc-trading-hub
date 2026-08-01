'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: '商品总览' },
  { href: '/routes', label: '贸易路线' },
  { href: '/reports', label: '泛天商报' },
  { href: '/trade', label: '玩家交易与合约' },
  { href: '/join', label: '加入我们' },
];

export function NavHeader() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-0.5">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`nav-tab${active ? ' active' : ''}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
