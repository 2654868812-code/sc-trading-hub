import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '玩家交易 - 泛天贸易',
};

export default function TradePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">玩家交易与合约</h1>
        <p className="text-sm text-muted-foreground">
          星际公民玩家间交易与合约平台
        </p>
      </div>

      <div className="section-card p-8 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          SCM 是由星际公民社区开发者维护的玩家交易市场，
          提供游戏内物品的玩家间买卖以及玩家间合约服务。
        </p>

        <a
          href="https://scm.flowcld.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground
                     text-sm font-semibold hover:bg-primary/90 transition-all
                     hover:shadow-[0_2px_16px_hsl(42_65%_45%/0.3)]"
        >
          前往 SCM 交易市场
          <span className="text-xs opacity-70">↗</span>
        </a>
      </div>
    </div>
  );
}
