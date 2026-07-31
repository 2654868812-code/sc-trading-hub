'use client';

import { useState } from 'react';

interface HelpCategory {
  id: string;
  title: string;
  dotColor: string;
  content: React.ReactNode;
}

export default function HelpPage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  function toggle(id: string) {
    setActiveId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">帮助中心</h1>
        <p className="text-sm text-muted-foreground mt-1">点击下方分类卡片查看详细说明</p>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => {
          const active = activeId === cat.id;
          return (
            <div key={cat.id} className="relative">
              <button
                onClick={() => toggle(cat.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all
                  ${active
                    ? 'border-primary/60 bg-primary/5 shadow-[0_0_12px_hsl(42_65%_45%/0.1)]'
                    : 'border-border/40 bg-card hover:border-border/60 hover:bg-accent/30'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.dotColor }} />
                  <span className={`text-sm font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>
                    {cat.title}
                  </span>
                  <span className={`ml-auto text-xs transition-transform ${active ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {active && (
                <div className="absolute left-0 right-0 top-full mt-1 z-40
                                p-5 rounded-lg border border-border/50 bg-card
                                shadow-[0_8px_32px_rgba(0,0,0,0.18)]
                                text-sm leading-relaxed text-muted-foreground space-y-3">
                  {cat.content}
                  <button
                    onClick={() => toggle(cat.id)}
                    className="absolute top-2 right-3 text-muted-foreground/50 hover:text-foreground transition-colors text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact */}
      <div className="section-card p-6 space-y-3">
        <h2 className="text-sm font-semibold">仍有疑问？</h2>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
          <p>
            加入商会 QQ 群：<span className="font-semibold tabular-nums text-foreground">1083464126</span>
          </p>
          <p>
            或联系 <span className="font-semibold text-foreground">@公</span>，
            QQ：<span className="font-semibold tabular-nums text-foreground">2654868812</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES: HelpCategory[] = [
  {
    id: 'profit',
    title: '利润算法',
    dotColor: '#4ade80',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">利润率 (Profit Margin)</h3>
          <p className="text-xs">利润率 = (全局卖均价 − 全局买均价) / 全局买均价 × 100%</p>
          <p className="text-[10px] mt-0.5">
            基于最新快照中所有终端的买入/卖出均价计算。绿色 = 高利润 (≥200%)，红色 = 亏损 (≤0%)，
            颜色从红→橙→黄→绿平滑过渡。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">单位利润 (Unit Profit)</h3>
          <p className="text-xs">单位利润 = 卖均价 − 买均价 (aUEC/SCU)</p>
          <p className="text-[10px] mt-0.5">
            绝对值，评估每单位货物实际收益。用于热力图"按利润"排序。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">利润变化 (▲/▼)</h3>
          <p className="text-xs">利润变化 = 本次单位利润 − 上次基准值 (aUEC)</p>
          <p className="text-[10px] mt-0.5">
            仅当单位利润发生变化时更新。绿色 ▲ = 利润上涨，红色 ▼ = 利润下跌。
            基准值在上次利润变动时记录。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">最大利润率 (Max Margin)</h3>
          <p className="text-xs">全终端最低买价 → 最高卖价的理论最大利润率</p>
          <p className="text-[10px] mt-0.5">反映该商品理论上可达到的最佳交易收益。</p>
        </div>
      </>
    ),
  },
  {
    id: 'sort',
    title: '排序规则',
    dotColor: '#38bdf8',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">按名称</h3>
          <p className="text-xs">按商品中文名拼音字母顺序排列。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">按利润率</h3>
          <p className="text-xs">利润率从高到低排列。缺利润率数据的商品排到末尾。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">按利润 (单位利润)</h3>
          <p className="text-xs">单位利润从高到低排列。缺少买价或卖价的商品排到末尾。</p>
          <p className="text-[10px] mt-0.5">
            与利润率排序的区别：高单价商品 (如 量子矿) 在利润排序中更靠前，
            而利润率排序更能反映资金效率。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">贸易路线排序</h3>
          <p className="text-xs">
            <strong>总利润</strong> = 单位利润 × 可售量<br />
            <strong>ROI</strong> = 单位利润 / 买价 × 100%<br />
            <strong>距离</strong> = GM 距离排序 (无距离数据排末尾)
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'category',
    title: '商品分类',
    dotColor: '#c9a94e',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">大宗商品</h3>
          <p className="text-xs">历史最大买量 ≥ 2,000 SCU。流通量大、供需稳定，适合大批量跑商。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">小宗商品</h3>
          <p className="text-xs">历史最大买量 &lt; 2,000 SCU。流通量小、零散交易，单利可能更高但供应不稳定。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">商品种类 (Kind)</h3>
          <p className="text-xs">按 UEX 官方分类：金属、矿物、气体、食品、药品、燃料、化学品、电子产品、合金、废料等。</p>
          <p className="text-[10px] mt-0.5">
            不同种类的商品有不同的供需特征。例如气体类单价低但体积大，
            金属类供需稳定适合大宗贸易，药品类部分为违禁品需注意交易终端合法性。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">违禁品 (Illegal)</h3>
          <p className="text-xs">标有 <span className="text-destructive font-bold">!</span> 的商品为违禁品，只能在非法终端出售，风险高但利润极高。</p>
        </div>
      </>
    ),
  },
  {
    id: 'routes',
    title: '贸易路线',
    dotColor: '#a78bfa',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">路线价格</h3>
          <p className="text-xs">买价 = 起点终端 3 日均价 (无则用最新快照价)，卖价同理。</p>
          <p className="text-[10px] mt-0.5">使用 3 日均价而非瞬时价格，降低单次价格波动对路线评估的影响。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">可售量 (Sell SCU)</h3>
          <p className="text-xs">可售量 = min(货船舱容, 起点平均库存, 终点最大库存)</p>
          <p className="text-[10px] mt-0.5">限制因素：你的货船能装多少、起点有多少货、终点能收多少。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">总投资额</h3>
          <p className="text-xs">总投资额 = 买价 × 可售量</p>
          <p className="text-[10px] mt-0.5">只计算你能卖出的那部分货物成本，不会多买浪费。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">往返航线</h3>
          <p className="text-xs">勾选后仅显示双向均有利润的路线。避免空载返程。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">仅空间站</h3>
          <p className="text-xs">选择仅空间站货船时自动过滤地面站点，确保路线在停靠能力范围内。</p>
        </div>
      </>
    ),
  },
  {
    id: 'data',
    title: '数据同步',
    dotColor: '#fb923c',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">数据来源</h3>
          <p className="text-xs">所有价格数据来自 UEX Corp 公开 API (v2.0)。感谢 UEX 和汉化盒子的数据支持。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">同步频率</h3>
          <p className="text-xs">
            每 30 分钟自动同步一次最新价格快照。<br />
            每日凌晨 3:07 进行元数据刷新 (商品列表、终端信息、货船数据)。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">3 日均价计算</h3>
          <p className="text-xs">均价基于最近 3 天的 PriceSnapshot 计算，替代 UEX 全时均值。</p>
          <p className="text-[10px] mt-0.5">
            终端级均价：每个终端每种商品的买卖均价和库存均值。<br />
            商品级均价：跨终端汇总的全局均价。<br />
            最大库存来自 UEX 全时统计，不被 3 日均值覆写。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">数据保留</h3>
          <p className="text-xs">PriceSnapshot 保留 30 天用于历史趋势图，过期自动清理。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">页面自动刷新</h3>
          <p className="text-xs">贸易路线页每 60 秒检测一次数据更新，有新数据时自动重新查询。</p>
        </div>
      </>
    ),
  },
  {
    id: 'filter',
    title: '筛选器使用',
    dotColor: '#f472b6',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">货船选择 (必选)</h3>
          <p className="text-xs">选择货船后系统根据 SCU 容量计算装载量和投资额。选"仅空间站"的船会自动过滤地面站点。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">商品筛选</h3>
          <p className="text-xs">可搜索并选择特定商品查看其所有买卖路线。为空则展示全部商品。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">星系与地点</h3>
          <p className="text-xs">起/终点星系下拉筛选 + 起/终点地点搜索。地点搜索支持中文名称。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">最大投资 / 最大距离</h3>
          <p className="text-xs">按 ±10 倍步进调节。投资额限制总买入成本，GM 距离过滤远距离路线。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">自动装卸</h3>
          <p className="text-xs">
            全程自动 = 两端都支持自动装卸，装卸快效率高。<br />
            半程自动 = 仅一端自动，适合部分手动操作。<br />
            全手动 = 两端都需手动装卸，适合特殊需求。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">筛选条件持久化</h3>
          <p className="text-xs">筛选条件自动同步到 URL，刷新页面不丢失，可复制链接分享查询结果。</p>
        </div>
      </>
    ),
  },
];
