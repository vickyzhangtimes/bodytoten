import Image from "next/image";
import Link from "next/link";
import { HomeCanvasScaler } from "./HomeCanvasScaler";

const totemSamples = [
  {
    name: "快乐云腹",
    desc: "吃饱也柔软，云朵会发光",
    image: "/totems/happy-cloud-belly.png",
  },
  {
    name: "月亮圆章",
    desc: "圆圆脸也有自己的月光",
    image: "/totems/moon-face-emblem.png",
  },
  {
    name: "隐形蘑菇",
    desc: "社恐充电中，边界很可爱",
    image: "/totems/invisible-mushroom.png",
  },
  {
    name: "慢慢龟印",
    desc: "慢一点，生活也可以抵达",
    image: "/totems/slow-turtle-seal.png",
  },
];

const processSteps = [
  {
    num: "01",
    title: "写下小烦恼",
    desc: "用一句话说出你的小情绪或困扰。",
  },
  {
    num: "02",
    title: "AI 生成图腾",
    desc: "AI 转译情绪，生成你的专属图腾形象。",
  },
  {
    num: "03",
    title: "转成商品",
    desc: "一键生成商品预览，支持生产与定制。",
  },
];

const loopSteps = [
  ["用户表达", "一句话说出小烦恼"],
  ["AI 情绪转译", "理解情绪与特征"],
  ["图腾设计", "生成专属图腾形象"],
  ["商品预览", "徽章 / 手机壳 / 贴纸"],
  ["工厂生产", "对接工厂，安排生产"],
];

export default function Home() {
  return (
    <main className="page landing-page home-16">
      <HomeCanvasScaler />
      <div className="shell app-frame home-frame">
        <header className="topbar landing-topbar home-topbar">
          <Link className="brand home-brand" href="/" aria-label="BodyTotem 首页">
            <img src="/brand/bodytotem-mark.svg" alt="" className="brand-mark" />
            <span>BodyTotem</span>
            <small>身体图腾所</small>
          </Link>
          <nav className="nav-links home-nav" aria-label="首页导航">
            <a href="#totems">图腾样例</a>
            <a href="#demo">Demo 闭环</a>
            <a href="#how">如何工作</a>
            <a href="#loop">关于我们</a>
          </nav>
          <Link className="button nav-cta home-nav-cta" href="/create">
            <span className="cta-star" aria-hidden="true" />
            开始生成
          </Link>
        </header>

        <section className="home-hero-row">
          <div className="home-copy">
            <img src="/brand/cloud-charm.svg" alt="" className="home-charm" />
            <h1>
              <span>说出你的小烦恼，</span>
              <strong>AI 为你生成专属图腾</strong>
            </h1>
            <p className="lead">
              不上传照片，不评价身体。你输入一句话，AI 将小情绪转译成可爱图腾商品，陪伴你的每一天。
            </p>
            <div className="actions home-actions">
              <Link className="button home-primary-cta" href="/create">
                <span className="cta-star" aria-hidden="true" />
                开始生成我的图腾
              </Link>
              <a className="button secondary home-secondary-cta" href="#totems">
                <span className="outline-icon" aria-hidden="true" />
                查看图腾样例
              </a>
            </div>
            <div className="home-assurance" aria-label="产品承诺">
              <span>隐私安全</span>
              <span>不上传照片</span>
              <span>可分享可佩戴</span>
              <span>可生产可定制</span>
            </div>
          </div>

          <aside className="home-demo-panel" id="demo" aria-label="BodyTotem Demo 闭环">
            <div className="demo-stage-tabs">
              <span>1. 你的小烦恼</span>
              <span>2. AI 情绪转译</span>
              <span>3. 专属图腾生成</span>
              <span>4. 商品预览</span>
            </div>
            <div className="demo-stage-main">
              <div className="demo-input-bubble">
                <p>每次吃完就想躺平，肚子像装了个云</p>
              </div>
              <span className="demo-arrow" aria-hidden="true">→</span>
              <div className="demo-ai-card">
                <div className="demo-ai-icon" aria-hidden="true">AI</div>
                <strong>快乐云腹</strong>
                <span>云柔柔，心轻轻</span>
              </div>
              <span className="demo-arrow" aria-hidden="true">→</span>
              <div className="demo-totem-card">
                <Image
                  src="/totems/happy-cloud-belly.png"
                  alt="快乐云腹图腾"
                  width={300}
                  height={260}
                  priority
                />
              </div>
              <div className="demo-product-stack" aria-label="商品预览">
                {["徽章", "手机壳", "贴纸"].map((item) => (
                  <div className="demo-product-mini" key={item}>
                    <Image
                      src="/totems/happy-cloud-belly.png"
                      alt={`快乐云腹${item}`}
                      width={110}
                      height={110}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="demo-production-status">
              <span className="status-check" aria-hidden="true">✓</span>
              生产单已生成，可进入工厂生产流程
            </div>
          </aside>
        </section>

        <section className="home-mid-row">
          <div className="home-process-card" id="how">
            <h2>从一句小烦恼，到一件专属商品</h2>
            <div className="home-process-grid">
              {processSteps.map((step) => (
                <article className="home-step-card" key={step.num}>
                  <span className="home-step-icon">{step.num}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="home-gallery-card" id="totems">
            <h2>每个小烦恼，都可以有一枚图腾</h2>
            <div className="home-totem-grid">
              {totemSamples.map((item) => (
                <article className="home-totem-sample" key={item.name}>
                  <div className="sample-image-shell">
                    <Image src={item.image} alt={item.name} width={160} height={140} />
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-loop-card" id="loop" aria-label="AI 内容生产到商品生产闭环">
          <h2>AI 内容生产 × 商品生产闭环</h2>
          <div className="home-loop-flow">
            {loopSteps.map(([title, desc], index) => (
              <div className="home-loop-node" key={title}>
                <span className="loop-symbol">{String(index + 1).padStart(2, "0")}</span>
                <strong>{title}</strong>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="home-bottom-cta">
          <div>
            <h2>把小烦恼变成小图腾，把情绪变成可佩戴的治愈能量。</h2>
            <p>BodyTotem 将 AI 生成从“内容生产”推进成“商品生产前端”。</p>
          </div>
          <Link className="button home-primary-cta" href="/create">
            <span className="cta-star" aria-hidden="true" />
            开始生成我的图腾
          </Link>
        </section>
      </div>
    </main>
  );
}
