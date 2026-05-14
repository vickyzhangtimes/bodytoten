import Image from "next/image";
import Link from "next/link";

const totemSamples = [
  {
    name: "快乐云腹",
    desc: "把小肚子转译成松弛感",
    image: "/totems/happy-cloud-belly.png",
  },
  {
    name: "青春星野",
    desc: "把长痘痘转译成生长力",
    image: "/totems/spring-star-field.png",
  },
  {
    name: "轻羽冠",
    desc: "把发量焦虑转译成留白风格",
    image: "/totems/feather-crown.png",
  },
  {
    name: "口袋山丘",
    desc: "把小个子转译成站稳世界",
    image: "/totems/pocket-hill.png",
  },
];

const flowSteps = [
  ["01", "表达", "写下一句小烦恼"],
  ["02", "转译", "AI 生成官方图腾 IP"],
  ["03", "商品", "生成徽章、手机壳、贴纸"],
  ["04", "生产", "输出订单与工厂生产单"],
];

const proofItems = ["不上传照片", "不评价身体", "16 个官方图腾", "订单生产单闭环"];

export default function Home() {
  return (
    <main className="apple-home">
      <header className="apple-nav">
        <Link className="apple-brand" href="/" aria-label="BodyTotem 首页">
          <img src="/brand/bodytotem-mark.svg" alt="" />
          <span>BodyTotem</span>
          <small>身体图腾所</small>
        </Link>
        <nav className="apple-nav-links" aria-label="首页导航">
          <a href="#flow">闭环</a>
          <a href="#totems">图腾库</a>
          <a href="#factory">生产单</a>
        </nav>
        <Link className="apple-nav-button" href="/create">开始生成</Link>
      </header>

      <section className="apple-hero" aria-label="BodyTotem 产品介绍">
        <div className="apple-hero-copy">
          <p className="apple-kicker">AI Coding Hackathon MVP</p>
          <h1>把一句小烦恼，变成一件可生产的商品。</h1>
          <p className="apple-lead">
            BodyTotem 不上传照片、不评价身体。它把用户主动说出的小特征，转译成个人图腾，再进入商品预览、模拟订单和工厂生产单。
          </p>
          <div className="apple-actions">
            <Link className="apple-primary" href="/create">生成我的图腾</Link>
            <a className="apple-secondary" href="#flow">查看闭环</a>
          </div>
          <div className="apple-proof-strip" aria-label="产品承诺">
            {proofItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="apple-product-stage" aria-label="快乐云腹商品化预览">
          <div className="apple-stage-copy">
            <span>Demo Case</span>
            <strong>快乐云腹</strong>
            <p>“我不是要藏起自己，我只是在收藏快乐。”</p>
          </div>
          <div className="apple-totem-focus">
            <Image
              src="/totems/happy-cloud-belly.png"
              alt="快乐云腹图腾"
              width={420}
              height={420}
              priority
            />
          </div>
          <div className="apple-product-row" aria-label="商品预览">
            <div className="apple-product apple-product-badge">
              <Image src="/totems/happy-cloud-belly.png" alt="快乐云腹徽章" width={126} height={126} />
              <span>徽章 · ¥29</span>
            </div>
            <div className="apple-product apple-product-phone">
              <Image src="/totems/happy-cloud-belly.png" alt="快乐云腹手机壳" width={126} height={126} />
              <span>手机壳 · ¥59</span>
            </div>
            <div className="apple-product apple-product-sticker">
              <Image src="/totems/happy-cloud-belly.png" alt="快乐云腹贴纸" width={126} height={126} />
              <span>贴纸 · ¥19</span>
            </div>
          </div>
        </div>
      </section>

      <section className="apple-flow" id="flow" aria-label="产品闭环">
        <div>
          <p className="apple-section-label">Product Loop</p>
          <h2>不是生成器，是一条商品化链路。</h2>
        </div>
        <div className="apple-flow-grid">
          {flowSteps.map(([num, title, desc]) => (
            <article className="apple-flow-step" key={num}>
              <span>{num}</span>
              <strong>{title}</strong>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="apple-totems" id="totems" aria-label="官方图腾样例">
        <div className="apple-section-head">
          <p className="apple-section-label">Totem Catalog</p>
          <h2>官方图腾库，让名字、图片、商品、生产单保持一致。</h2>
        </div>
        <div className="apple-totem-grid">
          {totemSamples.map((item) => (
            <article className="apple-totem-card" key={item.name}>
              <Image src={item.image} alt={item.name} width={180} height={180} />
              <strong>{item.name}</strong>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="apple-factory" id="factory" aria-label="生产单证明">
        <div>
          <p className="apple-section-label">Factory Sheet</p>
          <h2>AI 图腾已转化为可执行的生产信息。</h2>
          <p>商品类型、尺寸、材质、工艺、包装方式、设计文件和质检说明，全部由系统结构化输出。</p>
        </div>
        <Link className="apple-primary" href="/create">开始完整 Demo</Link>
      </section>
    </main>
  );
}
