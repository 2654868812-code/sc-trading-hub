export default function JoinPage() {
  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">

      {/* Block 1: 商会宣传 — letter style */}
      <div className="section-card p-6 md:p-8 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer-line" />

        <div className="text-center space-y-1 pt-2">
          <h1 className="logo-serif text-2xl font-bold tracking-tight text-primary">
            加入我们
          </h1>
        </div>

        <p className="text-sm font-semibold">致每一位星航者：</p>

        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground">
            想要为你的漫漫星途，寻一处温暖的避风港？
          </p>
          <p>
            欢迎加入由「泛天贸易中心」网站开发者{' '}
            <span className="font-semibold text-foreground">@公</span>{' '}
            创建的游戏内组织：
            <span className="font-semibold text-foreground">泛天商会</span>。
          </p>
          <p>我们是一方坚守中立的组织，信奉——</p>

          <blockquote
            className="text-center py-3 text-xl font-bold tracking-widest text-foreground leading-loose"
            style={{
              fontFamily: '"STXingkai", "华文行楷", "KaiTi", "STKaiti", "FangSong", "Noto Serif SC", serif',
            }}
          >
            商无域，利无涯。<br />
            货通九州，德载天下。
          </blockquote>

          <p>
            商业没有疆界，收益不设上限。我们以德行承载抱负，让货殖流通八方星域。
          </p>
          <p>
            商会的宗旨，是为每一位热爱游戏、主张和平的星航者，提供可以倚靠的庇护所。同时，我们更会以商运玩法为核心，带领大家投身游戏内多种玩法——跑商揽货、经营积累、采矿冶炼、打捞回收、赏金狩猎、舰船战斗、货物护送，在赚取海量资源的过程中，不断拓宽游戏体验，让这趟星辰旅途走得更高、更远。
          </p>
          <p className="font-medium text-foreground">
            加入我们，星辰大海，并肩同行。
          </p>
        </div>

        <div className="text-sm space-y-0.5">
          <p>
            <span className="text-muted-foreground">QQ群：</span>
            <span className="font-semibold tabular-nums">1083464126</span>
          </p>
          <p>
            <span className="text-muted-foreground">RSI 官网：</span>
            <a
              href="https://robertsspaceindustries.com/en/orgs/FANTIAN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              robertsspaceindustries.com/en/orgs/FANTIAN
            </a>
          </p>
        </div>

        <div className="flex items-end justify-between pt-1">
          <div className="space-y-0.5">
            <p className="text-sm text-muted-foreground/70">—— 泛天商会</p>
            <p className="text-[10px] tracking-[0.15em] text-muted-foreground/40">商无域 · 利无涯</p>
          </div>
          <img
            src="/logo.png"
            alt="泛天商会印章"
            className="w-20 h-20 object-contain opacity-85 -mb-1 -mr-1"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 gold-shimmer-line" />
      </div>

      {/* Right column */}
      <div className="space-y-6">

      {/* Block 2: 数据采集员 */}
      <div className="section-card p-6 space-y-3">
        <h2 className="text-sm font-semibold">
          想要成为数据采集员，为本网站上传游戏内的实时商品数据？
        </h2>
        <p className="text-sm text-muted-foreground leading-loose">
          数据采集伴侣插件正在开发中，当前网站使用的数据来自 UEX 的公开 API，每半小时更新一次。待到插件开发完成后将能通过网站下载插件，届时各位可借助插件截取游戏内终端的截图并被识别转化为数据上传至服务器，提高本网站数据实时性和准确性。
        </p>
      </div>

      {/* Block 3: 开发助力 */}
      <div className="section-card p-6 space-y-3">
        <h2 className="text-sm font-semibold">
          想要为本网站的开发提供助力或提出意见？
        </h2>
        <p className="text-sm text-muted-foreground leading-loose">
          请加入商会 QQ 群：<span className="font-semibold tabular-nums text-foreground">1083464126</span>，
          或与我 <span className="font-semibold text-foreground">@公</span> 联系，
          QQ：<span className="font-semibold tabular-nums text-foreground">2654868812</span>。
        </p>
      </div>

      </div>{/* end right column */}
      </div>{/* end grid */}
    </div>
  );
}
