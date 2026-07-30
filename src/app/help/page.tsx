export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto py-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">帮助</h1>
        <p className="text-sm text-muted-foreground mt-1">常见问题与联系方式</p>
      </div>

      {/* Q&A */}
      <div className="space-y-4">
        {QA.map((item, i) => (
          <div key={i} className="section-card p-5 space-y-2">
            <h2 className="text-sm font-semibold">{item.q}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        ))}
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

const QA = [
  {
    q: '网站数据多久更新一次？',
    a: '当前数据来自 UEX 公开 API，每 30 分钟自动同步一次，每日凌晨 3:07 进行元数据刷新。我们自己的数据采集插件正在开发中，届时玩家可借助插件截取游戏内终端截图并自动上传，进一步提升数据的实时性和准确性。页面顶部状态栏可查看上次更新时间。',
  },
  {
    q: '如何使用贸易路线功能？',
    a: '进入「贸易路线」页面，先选择一艘货船（必选），再设置筛选条件如起点/终点星系、最大投资额、自动装卸偏好等，点击「查询路线」即可。也可从商品总览点击任意商品快速跳转。',
  },
  {
    q: '利润率和利润变化是怎么算的？',
    a: '利润率 =（卖价 − 买价）÷ 买价 × 100%，取各终端有交易的均价计算。利润变化 = 本次单位利润 − 上次利润变动时的基准值，反映每 SCU 利润的涨跌额。商品详情页可查看各终端的买/卖价格趋势。',
  },
  {
    q: '大宗和小宗是什么意思？',
    a: '大宗商品指历史最大库存 ≥ 2000 SCU 的商品，适合大批量跑商，利润稳定但单利较低。小宗商品库存较少，单利可能更高但供应不稳定。热力图上可在搜索框旁切换。',
  },
  {
    q: '商品详情页怎么看？',
    a: '点击热力图中任意商品进入详情页，上半部分为买价/卖价趋势图（自动选取前 5 个终端），下半部分列出可购买和可售出的地点、当前库存与最大库存、数据更新时间，并可一键跳转贸易路线。',
  },
  {
    q: '泛天商会怎么加入？',
    a: '访问 RSI 官网组织页面申请加入：robertsspaceindustries.com/en/orgs/FANTIAN，或加入 QQ 群 1083464126。商会坚守中立，欢迎所有热爱游戏、主张和平的玩家。',
  },
  {
    q: '网站开源吗？可以参与开发吗？',
    a: '当前为闭源项目，但欢迎提出意见或参与测试。请联系 @公（QQ：2654868812）或加入商会 QQ 群交流。数据采集伴侣插件正在开发中，届时欢迎参与数据贡献。',
  },
];
