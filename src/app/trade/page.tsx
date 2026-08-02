import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '玩家交易 - 泛天贸易中心',
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

      <div className="section-card p-8 space-y-5">
        <img
          src="/scm-logo.jpg"
          alt="SCM"
          className="h-16 object-contain mx-auto"
        />

        <p className="text-sm text-muted-foreground leading-relaxed">
          为热爱星际公民的小伙伴们共同搭建的交易平台
          <br />
          为了让游戏内的物品交换更加便利而生
        </p>
        <a
          href="https://scm.flowcld.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground
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
