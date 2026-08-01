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
                                text-sm leading-relaxed text-muted-foreground space-y-3 break-words">
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
      <div className="section-card p-5 space-y-2">
        <p className="text-xs text-muted-foreground">
          未找到需要的信息？加入 QQ 群 <span className="font-semibold tabular-nums text-foreground">1083464126</span>
          ，或联系 <span className="font-semibold text-foreground">@公</span>（QQ <span className="font-semibold tabular-nums text-foreground">2654868812</span>）
        </p>
      </div>
    </div>
  );
}

const CATEGORIES: HelpCategory[] = [
  {
    id: 'overview',
    title: '商品总览',
    dotColor: '#4ade80',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">热力图</h3>
          <p className="text-xs">首页展示所有可交易商品，按大宗/小宗分两组。每格显示商品名、利润率和利润变化。鼠标悬停查看英文名和详细数据。点击进入商品详情页。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">大宗 vs 小宗</h3>
          <p className="text-xs">大宗商品流通量大、供需稳定，适合大批量跑商。小宗商品单利可能更高但供应不稳定。可通过搜索框和排序切换快速找到目标商品。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">利润率与颜色</h3>
          <p className="text-xs">利润率 = (卖均价 − 买均价) / 买均价 × 100%。绿色越深利润越高，红色表示亏损。颜色从红到绿平滑过渡。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">排序方式</h3>
          <p className="text-xs">
            <strong>按名称</strong>：中文拼音排序。<br />
            <strong>按利润率</strong>：百分比从高到低。<br />
            <strong>按利润</strong>：单位利润 (aUEC/SCU) 从高到低。高单价商品在此排序靠前。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">商品详情页</h3>
          <p className="text-xs">点击商品进入详情页，可查看买卖价格趋势图、各终端当前价格与库存、历史最高/最低/均价。点击「查看贸易路线」一键跳转。</p>
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
          <h3 className="text-foreground font-semibold text-xs mb-1">使用流程</h3>
          <p className="text-xs">选择货船 → 设置筛选条件 → 点击「查询路线」。也可从商品总览点击商品快速跳转，自动带入商品筛选。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">路线结果解读</h3>
          <p className="text-xs">每条路线显示购买地/出售地、买卖价格、库存状态、总投资额、总利润、单位利润 ( /SCU)、ROI 和距离。鼠标悬停可查看计算公式。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">库存条</h3>
          <p className="text-xs">购买地显示「均/最大库存」，出售地同理。进度条颜色：红色库存紧张、黄色适中、绿色充足。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">筛选器指南</h3>
          <p className="text-xs">
            <strong>货船</strong>（必选）：选船后根据 SCU 容量计算装载量和投资额。仅空间站的船会自动过滤地面站点。<br />
            <strong>商品</strong>：搜索特定商品，为空展示全部。<br />
            <strong>星系/地点</strong>：起终点独立筛选，支持地点搜索。<br />
            <strong>最大投资</strong>：限制总买入成本，±10 倍步进。<br />
            <strong>最大距离</strong>：过滤远距离路线。<br />
            <strong>商品类型</strong>：大宗/小宗过滤。<br />
            <strong>自动装卸</strong>：全程自动（两端都自动）/ 半程自动 / 全手动。<br />
            <strong>往返航线</strong>：仅显示来回都有利润的路线。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">筛选记住 & 自动刷新</h3>
          <p className="text-xs">筛选条件在切换页面后保留，也可复制链接分享。页面每 60 秒自动检测数据更新。</p>
        </div>
      </>
    ),
  },
  {
    id: 'reports',
    title: '泛天商报',
    dotColor: '#f472b6',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">商报是什么</h3>
          <p className="text-xs">泛天商报是商会的定期行情简报，包含推荐贸易路线、市场分析和商会公告，帮助会员快速了解当前市场行情。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">如何查看</h3>
          <p className="text-xs">访问「泛天商报」页面即可查看已发布的简报，包含推荐路线和行情分析。简报由商会维护人员定期更新。</p>
        </div>
      </>
    ),
  },
  {
    id: 'data',
    title: '数据说明',
    dotColor: '#fb923c',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">数据来源</h3>
          <p className="text-xs">价格数据来自 UEX Corp 公开接口。感谢 UEX 和汉化盒子的数据支持。本工具为非官方辅助工具。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">更新频率</h3>
          <p className="text-xs">每 30 分钟自动同步一次最新价格。页面顶部状态栏可查看上次更新时间。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">价格说明</h3>
          <p className="text-xs">展示的买卖价格和库存数据基于最近 3 天均值，比瞬时价格更稳定可靠。最大库存来自历史统计。</p>
        </div>
      </>
    ),
  },
  {
    id: 'join',
    title: '加入我们',
    dotColor: '#c9a94e',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">泛天商会</h3>
          <p className="text-xs">坚守中立，欢迎所有热爱游戏、主张和平的玩家加入。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">加入方式</h3>
          <p className="text-xs">
            RSI 组织页面：<span className="break-all">robertsspaceindustries.com/en/orgs/FANTIAN</span><br />
            QQ 群：1083464126<br />
            联系 @公，QQ：2654868812
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">反馈建议</h3>
          <p className="text-xs">欢迎提出意见或反馈 bug。数据采集插件正在开发中，届时欢迎参与数据贡献。</p>
        </div>
      </>
    ),
  },
];
