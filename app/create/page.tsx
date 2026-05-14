"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { StepBar } from "@/components/StepBar";
import { saveResult } from "@/lib/storage";
import type { GenerateResponse } from "@/lib/types";

const TAGS = [
  { label: "小肚子", prompt: "我有一点小肚子，但我很爱吃，拍照时总想遮住。" },
  { label: "圆脸", prompt: "我脸比较圆，拍照时总会担心不够上镜。" },
  { label: "小个子", prompt: "我个子不高，有时候合照会有点在意。" },
  { label: "发量少", prompt: "我头发有点少，拍照时会有点没安全感。" },
  { label: "长痘痘", prompt: "我最近皮肤状态不太稳定，出门拍照时会有点在意。" },
  { label: "社恐", prompt: "我在人多的时候会紧张，常常想安静地躲一会儿。" },
  { label: "拖延", prompt: "我总是容易拖延，明明想开始，却要磨蹭很久。" },
  { label: "爱熬夜", prompt: "我很爱熬夜，夜里反而会突然有灵感。" },
  { label: "拍照僵硬", prompt: "我一面对镜头就会僵硬，不知道手脚该放哪里。" },
];

const LOADING_LINES = [
  "AI 正在把你的小烦恼转译成专属图腾……",
  "识别情绪核心，寻找正向符号……",
  "生成图腾故事与视觉关键词……",
  "匹配商品形态，准备生产参数……",
];

export default function CreatePage() {
  const [input, setInput] = useState("我有一点小肚子，但我又很爱吃，拍照时总想遮住。");
  const [tone, setTone] = useState("温柔、有趣、有一点力量");
  const [loading, setLoading] = useState(false);
  const [loadingLine, setLoadingLine] = useState(0);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!loading) void generate();
  }

  async function generate() {
    if (!input.trim()) {
      setError("先写一句你想转译的小烦恼。");
      return;
    }
    setLoading(true);
    setError("");
    setLoadingLine(0);

    const timer = setInterval(() => {
      setLoadingLine((prev) => (prev + 1) % LOADING_LINES.length);
    }, 900);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input, tone }),
      });
      if (!response.ok) throw new Error("generate api failed");
      const result = (await response.json()) as GenerateResponse;
      saveResult(result);
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="shell app-frame">
        <div className="topbar">
          <a className="brand" href="/">
            <span className="mark-dot" />
            BodyTotem
          </a>
          <nav className="nav-links" aria-label="流程导航">
            <a href="/#totems">图腾样例</a>
            <a href="/#demo">Demo 闭环</a>
            <a href="/#how">如何工作</a>
          </nav>
          <span className="badge">图腾工坊</span>
        </div>
        <StepBar current={1} />
        <div className="process-marquee process-marquee-compact" aria-label="BodyTotem 产品闭环">
          <div className="process-track">
            {["输入", "AI 转译", "图腾", "商品", "订单", "生产单", "输入", "AI 转译", "图腾", "商品", "订单", "生产单"].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>

        <section className="create-layout">
          <div className="panel panel-pad prompt-card flow-card">
            <div className="workshop-label">BodyTotem Workshop</div>
            <h1 className="create-title">说出一个小烦恼，AI 把它变成可下单图腾</h1>
            <p className="muted">不上传照片，不评价身体。这里做的是温柔转译：把你主动写下的小特征，变成图腾、商品和生产单。</p>
            <div className="proof-strip">
              <div className="proof">
                <strong>01</strong>
                <span>输入一个小烦恼</span>
              </div>
              <div className="proof">
                <strong>02</strong>
                <span>生成个人图腾</span>
              </div>
              <div className="proof">
                <strong>03</strong>
                <span>转成订单生产单</span>
              </div>
            </div>
          </div>

          <div className="panel panel-pad flow-card create-form-panel">
            {loading ? (
              <div className="loading-overlay" aria-live="polite">
                <div className="loading-ring" />
                <div className="loading-dots">
                  <span /><span /><span />
                </div>
                <strong className="loading-title">已收到，正在生成</strong>
                <p className="loading-text">{LOADING_LINES[loadingLine]}</p>
              </div>
            ) : (
              <form className="create-form-stack" onSubmit={handleSubmit}>
                <div className="form-intro">
                  <div>
                    <div className="label">表达入口</div>
                    <h2>先写一句真实的话</h2>
                  </div>
                  <span>AI 会转译，不会评判</span>
                </div>
                <div className="field">
                  <label className="label" htmlFor="input">小烦恼</label>
                  <textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="比如：我有一点小肚子，但我很爱吃，拍照时总想遮住。"
                  />
                  <p className="helper-text">建议写成一句真实的话：我在意什么、什么时候会在意、我希望它被怎样温柔地看见。</p>
                </div>
                <div className="starter-row">
                  <span>快速试一个</span>
                  <strong>官方会把这些说法转成图腾，不会原样放大焦虑。</strong>
                </div>
                <div className="chips">
                  {TAGS.map((tag) => (
                    <button
                      className={`chip ${input === tag.prompt ? "selected" : ""}`}
                      key={tag.label}
                      type="button"
                      onClick={() => {
                        setInput(tag.prompt);
                        setError("");
                      }}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
                <div className="craft-note">
                  <span>生成后你会看到</span>
                  <strong>图腾设定、AI 图像、商品 Mockup、模拟订单和工厂生产单。</strong>
                </div>
                <div className="field">
                  <label className="label" htmlFor="tone">语气</label>
                  <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option>温柔、有趣、有一点力量</option>
                    <option>潮牌、反叛、适合贴纸</option>
                    <option>东方图腾、治愈、收藏感</option>
                  </select>
                </div>
                {error ? <div className="error">{error}</div> : null}
                <button className="button" type="submit" disabled={!input.trim() || loading}>
                  生成我的图腾
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
