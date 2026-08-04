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
          <p className="text-xs">历史最大买入量 ≥ 2,000 SCU 归为大宗，流通量大、供需稳定，适合大批量跑商。小宗商品单利可能更高但供应不稳定。搜索框和排序切换可快速定位目标商品。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">利润率与色阶</h3>
          <p className="text-xs">利润率 = (当前卖均价 − 当前买均价) / 当前买均价 × 100%。颜色从红（低）到绿（高）渐变，大宗商品和小宗商品各自独立计算色阶范围，互不干扰。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">排序方式</h3>
          <p className="text-xs">
            <strong>按名称</strong>：中文拼音排序。<br />
            <strong>按利润率</strong>：百分比从高到低。<br />
            <strong>按利润</strong>：单位利润 (aUEC/SCU) 从高到低。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">商品详情页</h3>
          <p className="text-xs">点击商品进入详情页，可查看买卖价格趋势图（24h/72h/7天）、各终端当前价格与库存、历史最高/最低/均价。点击「查看贸易路线」一键跳转。</p>
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
          <p className="text-xs">选择货船 → 设置筛选条件 → 点击「查询路线」。也可从商品总览点击商品快速跳转，自动带入商品筛选。「重置」按钮一键清空所有筛选条件和结果。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">路线结果解读</h3>
          <p className="text-xs">每条路线显示购买地/出售地、买卖价格、库存状态、总投资额、总利润、单位利润 (/SCU)、利润率、距离和货箱规格（最小-最大）。鼠标悬停可查看计算公式。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">库存条</h3>
          <p className="text-xs">购买地和出售地均显示「近3日均库存 / 历史最高库存」。进度条颜色：红色库存紧张、黄色适中、绿色充足。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">利润算法</h3>
          <p className="text-xs">
            <strong>期望利润</strong>：按近3日买入地平均库存估算载货量，利润数字反映当前真实交易水平。<br />
            <strong>最大利润</strong>：按买入地历史最高库存估算载货量（理想上限，当前库存往往达不到），利润是理论上限。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">往返路线</h3>
          <p className="text-xs">勾选「往返航线」后仅显示来回都有利润的路线组。每条往返路线卡片内用完整表格展示去程和回程明细，卡片顶部显示往返总成本和总利润。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">筛选器指南</h3>
          <p className="text-xs">
            <strong>货船</strong>（必选）：选船后根据 SCU 容量计算装载量和投资额。仅外部货柜的船自动过滤无货柜的站点。<br />
            <strong>商品</strong>：搜索特定商品，不选则展示全部。<br />
            <strong>星系/地点</strong>：起终点独立筛选，支持地点搜索。<br />
            <strong>最大投资</strong>：限制总买入成本，±10 倍步进。<br />
            <strong>最大距离</strong>：过滤远距离路线。<br />
            <strong>商品类型</strong>：大宗/小宗，与首页标准一致（历史最大买入量 ≥ 2,000 SCU 为大宗）。<br />
            <strong>自动装卸</strong>：全程自动（两端都有）/ 半程自动 / 全手动。<br />
            <strong>排序</strong>：按总利润 / 利润率 / 距离排序。<br />
            <strong>利润算法</strong>：期望利润（3日均库存）或最大利润（五级回退取最优库存）。
          </p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">筛选记住 & 自动刷新</h3>
          <p className="text-xs">筛选条件切换页面后保留，也可复制链接分享。页面每 60 秒自动检测数据更新并刷新结果。</p>
        </div>
      </>
    ),
  },
  {
    id: 'commodity-detail',
    title: '商品详情',
    dotColor: '#38bdf8',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">进入方式</h3>
          <p className="text-xs">从首页热力图点击任意商品，或使用右下角搜索浮窗（Ctrl+K）搜索商品名进入。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">页面结构</h3>
          <p className="text-xs">顶部显示商品中文名、英文名和种类标签。点击「查看贸易路线 →」可一键跳转到路线筛选器，自动带入该商品。下方有时间范围选择器（24h/3d/7d/30d/90d），切换后图表和统计数据同步更新。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">价格趋势图</h3>
          <p className="text-xs">左右双栏展示买价趋势和卖价趋势。图表横轴为时间、纵轴为价格 (aUEC)，每条折线代表一个终端。默认选取买价/卖价最高的 5 个终端绘图，图例显示终端名。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">可购买 / 可售出地点</h3>
          <p className="text-xs">图表下方双栏列出所有可购买和可售出该商品的终端。每行显示：地点名（点击进入地点详情）、星系·行星·卫星、当前库存（格式：当前 / 最大）、当前买价/卖价、近3日均价/最高价/最低价。价格下方显示该商品在该终端的最后更新时间。</p>
        </div>
      </>
    ),
  },
  {
    id: 'location-detail',
    title: '地点详情',
    dotColor: '#fbbf24',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">进入方式</h3>
          <p className="text-xs">从路线结果中点击购买地或出售地，或从商品详情页点击终端名，也可通过搜索浮窗（Ctrl+K）搜索地点名进入。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">页面结构</h3>
          <p className="text-xs">顶部显示地点名、终端数量标签和星系·行星·卫星位置信息。位置下方显示该地点所有终端的设施标签（货运中心、停机坪、货梯、外部货柜、自动装卸、精炼站、医疗、餐饮、加油、维修、居住区），多终端取并集。点击「查看贸易路线 →」可一键跳转到路线筛选器，自动带入该地点作为起点。下方有时间范围选择器和买卖价格趋势图，展示该地点交易量最高的前几种商品的价格走势。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">价格趋势图</h3>
          <p className="text-xs">与商品详情页相同的双栏布局，但折线代表不同的商品（而非不同终端）。图表展示该地点买价最高和卖价最高的商品价格随时间的变化趋势。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">可购买 / 可售出商品</h3>
          <p className="text-xs">双栏列出该地点所有终端可购买和可售出的商品。每行显示：商品名（点击进入商品详情）、种类标签、终端名·英文名·商品代码、当前库存（格式：当前 / 最大）、利润率、当前价格、近3日均价/最高价/最低价，以及更新时间。</p>
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
    id: 'tips',
    title: '跑商贴士',
    dotColor: '#2dd4bf',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">贴士浮窗</h3>
          <p className="text-xs">页面右下角灯泡按钮（搜索按钮上方）可在任意页面查看全部跑商注意事项。点击按钮或弹出的气泡即可打开列表。每 1.5 分钟自动轮播一条新贴士，显示 9 秒后自动消失。点击「不再提示」可将当前页面静音，静音状态通过链接参数保存。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">内容维护</h3>
          <p className="text-xs">贴士内容由商报维护人员在编辑页面统一管理，支持增删改。修改后保存即在全站生效。</p>
        </div>
      </>
    ),
  },
  {
    id: 'market-index',
    title: '泛天指数',
    dotColor: '#c9a94e',
    content: (
      <>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">指数定义</h3>
          <p className="text-xs">泛天指数衡量全市场跑商景气度。公式：Σ[(最高卖价 − 最低买价) × 最大库存] / Σ(最低买价 × 最大库存) × 100%。取每个商品最新快照中的最低买价和最高卖价，以 UEX 历史最大买入量为权重加权计算。大宗商品（如废料）权重高，小宗商品（如稀有种子）权重低。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">如何查看</h3>
          <p className="text-xs">首页状态栏显示「泛天指数：XX%」，数字颜色从红（低）到绿（高）反映当前水平在 90 日历史中的位置。点击进入详情页可查看折线走势图、最高最低值和完整定义。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">数值含义</h3>
          <p className="text-xs">指数 60% 意味着按照最优买卖组合，每投入 100 万 aUEC 可获利 60 万。指数越高，市场利润空间越大。每 30 分钟数据更新时重新计算。</p>
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
          <p className="text-xs">价格数据来自 UEX Corp 公开接口。感谢 UEX 和汉化盒子的数据支持。泛天指数为本站自行计算的市场景气度指标，详见泛天指数分类。本工具为非官方辅助工具。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">更新频率</h3>
          <p className="text-xs">每 30 分钟从 UEX 自动拉取一次最新价格。全部历史数据永久存储，价格趋势图可回溯任意时间段。</p>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-xs mb-1">价格与库存</h3>
          <p className="text-xs">买卖价格来自最新快照的实时数据，非历史均价。路线利润基于当前差价计算。库存列和载货量计算使用五级回退链：UEX终端历史最大 → 本地快照历史最大 → 当前快照库存 → UEX全宇宙历史最大 → 兜底值1。确保在任何数据缺失情况下都能得到合理的库存估值。</p>
        </div>
      </>
    ),
  },
];
