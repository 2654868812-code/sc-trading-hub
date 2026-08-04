'use client';

import { useState } from 'react';

const TIPS = [
  '大宗商品价格相对稳定，适合新手入门；小宗商品利润率高但风险也更大。',
  '进货前务必查看目的地的库存量，避免空仓白跑一趟。',
  '利润率高的商品往往流通速度慢，囤货需谨慎。',
  '建议同时关注利润率变化趋势（▲/▼），持续上升说明路线正变得热门。',
  '部分终端只支持特定尺寸货柜，选船前请确认终端的装卸能力。',
  '非法商品利润极高，但被查获会血本无归，风险自负。',
  '同一条路线往返利润率可能不同，善用"往返"模式对比。',
  '建议每次跑商前刷新数据，UEX 每 30 分钟更新一次价格。',
  'Hull 系列货船只能在有外部货柜设施的终端装卸货。',
  '泛天指数上涨表示整体市场活跃，下跌则需谨慎操作。',
  '终端设有医疗/精炼/加油/维修等设施，可在商品详情页查看。',
  '长期不交易的路线利润率可能失真，建议优先选择近期有成交的路线。',
];

export default function TipsFloat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button — same style as search button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-[7rem] right-6 lg:bottom-32 lg:right-10 z-50
                   w-14 h-14 lg:w-[64px] lg:h-[64px] rounded-full
                   bg-primary text-primary-foreground shadow-lg
                   hover:shadow-xl hover:bg-primary/90 active:scale-95
                   transition-all duration-200 flex items-center justify-center"
        title="跑商贴士"
      >
        <span className="text-xl lg:text-2xl">💡</span>
      </button>

      {/* Tips panel */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
             onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-sm max-h-[70vh] overflow-y-auto rounded-xl border border-border
                        bg-card shadow-2xl p-5 space-y-3 animate-in slide-in-from-bottom-4 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">💡 跑商注意事项</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 5l8 8M13 5l-8 8" />
                </svg>
              </button>
            </div>
            <ul className="space-y-2">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed">
                  <span className="text-muted-foreground/40 shrink-0 mt-0.5 text-[10px]">{i + 1}.</span>
                  <span className="text-foreground/80">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
