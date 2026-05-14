"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductConfirmModal } from "@/components/ProductConfirmModal";
import { StepBar } from "@/components/StepBar";
import { generateMockResponse } from "@/lib/mockData";
import { isCurrentResult, loadResult, saveProduct, saveResult } from "@/lib/storage";
import type { GenerateResponse, Product } from "@/lib/types";
import { gradientToTheme, pickGradient } from "@/lib/coolhue";

export default function ResultPage() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [imageJob, setImageJob] = useState<"idle" | "generating" | "ready" | "fallback">("idle");
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const imageRequested = useRef(false);
  const router = useRouter();

  async function generateImage(current: GenerateResponse) {
    setImageJob("generating");
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: current.session_id,
          slug: current.totem.slug,
          fallback_image_url: current.image.fallback_image_url
        })
      });
      if (!response.ok) throw new Error("generate-image api failed");
      const image = await response.json() as GenerateResponse["image"];
      const updated: GenerateResponse = {
        ...current,
        status: image.source === "ai" || image.status === "ready" ? "IMAGE_READY" : current.status,
        image: {
          source: image.source,
          status: image.source === "ai" ? "ready" : image.status,
          image_url: image.image_url,
          generated_image_url: image.generated_image_url,
          fallback_image_url: image.fallback_image_url,
          quality_check: image.quality_check
        },
        totem: {
          ...current.totem,
          image_url: image.image_url
        }
      };
      saveResult(updated);
      setResult(updated);
      setImageJob(image.source === "ai" ? "ready" : "fallback");
    } catch {
      setImageJob("fallback");
    }
  }

  useEffect(() => {
    const stored = loadResult();
    if (isCurrentResult(stored)) {
      setResult(stored);
      return;
    }

    async function createDemoResult() {
      const demoInput = "我有一点小肚子，但我又很爱吃，拍照时总想遮住。";
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_input: demoInput }),
        });
        if (!response.ok) throw new Error("generate api failed");
        const generated = (await response.json()) as GenerateResponse;
        saveResult(generated);
        setResult(generated);
      } catch {
        const fallback = generateMockResponse(demoInput);
        saveResult(fallback);
        setResult(fallback);
      }
    }

    createDemoResult();
  }, []);

  useEffect(() => {
    if (!result || imageRequested.current || result.image.source === "ai" || result.image.status !== "needs_generation") return;
    imageRequested.current = true;
    void generateImage(result);
  }, [result]);

  function selectProduct(product: Product) {
    setPendingProduct(product);
  }

  function confirmProduct() {
    if (!pendingProduct) return;
    saveProduct(pendingProduct);
    router.push("/order");
  }

  if (!result) return null;
  const { totem, products } = result;
  const imageUrl = result.image?.image_url ?? totem.image_url;
  const visualKeywords = totem.visual_keywords ?? totem.visual_elements;
  const quality = result.image?.quality_check;
  const imageStatus = result.image?.status ?? "ready";
  const isImageGenerating =
    imageJob === "generating" || (imageStatus === "needs_generation" && imageJob === "idle");
  const isImageFallback = imageStatus === "fallback" || imageStatus === "placeholder" || imageJob === "fallback";
  const showProducts = imageStatus === "ready" && !isImageGenerating;
  const imageStatusText =
    isImageGenerating
      ? "正在生成专属图腾图像"
      : result.image?.source === "ai"
        ? quality?.label ?? "AI 图像已生成"
        : imageStatus === "ready"
          ? "官方图腾资产"
          : imageStatus === "fallback"
            ? "临时图腾预览"
            : "等待图像生成";

  const theme = gradientToTheme(pickGradient(totem.slug ?? totem.totem_name));
  const themeVars = {
    "--grad-btn": theme.btnGrad,
    "--border-active": theme.borderActive,
    "--purple": theme.accent,
    "--purple-end": theme.accentEnd,
    "--bg-grad": theme.bgGrad,
  } as React.CSSProperties;

  const insightRows = [
    {
      icon: "🧠",
      colorClass: "insight-icon-blue",
      label: "AI 如何理解你",
      text: totem.safe_reframe,
    },
    {
      icon: "❤️",
      colorClass: "insight-icon-pink",
      label: "图腾含义",
      text: totem.positive_interpretation || totem.personalized_sentence,
    },
    {
      icon: "👁",
      colorClass: "insight-icon-teal",
      label: "视觉方向",
      text: visualKeywords.slice(0, 6).join("、") + "，营造轻盈、明亮的氛围。",
    },
    {
      icon: "🛡",
      colorClass: "insight-icon-purple",
      label: "安全转译说明",
      text: totem.safety_note || "将对身体的批评性语言，转译为积极、温暖、可自我接纳的图像符号，帮助你建立更友好的自我关系。",
    },
  ];

  return (
    <main className="page" style={themeVars}>
      {pendingProduct && result ? (
        <ProductConfirmModal
          product={pendingProduct}
          totemImageUrl={imageUrl}
          totemName={totem.totem_name}
          onConfirm={confirmProduct}
          onClose={() => setPendingProduct(null)}
        />
      ) : null}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="shell app-frame">
        {/* ── TopBar ── */}
        <div className="topbar">
          <a className="brand" href="/">
            <span className="mark-dot" />
            <span>BodyTotem</span>
            <span className="brand-sub">身体图腾所</span>
          </a>
          <nav className="nav-links" aria-label="流程导航">
            <a href="/#totems">图腾计划</a>
            <a href="/#demo">Demo 闭环</a>
            <a href="/#how">如何工作</a>
            <a href="/#about">关于我们</a>
          </nav>
          <a className="button result-cta-btn" href="/create">+ 开始生成</a>
        </div>

        <StepBar
          current={4}
          prevHref="/create"
          imageSource={result.image?.source}
          imageBusy={isImageGenerating}
          textLive={result.meta?.source === "llm"}
        />

        <section className="result-grid">
          {/* ── Left: Collector Card ── */}
          <div className="panel panel-pad flow-card totem-collector-card">
            <div className="collector-header">
              <span className="collector-label">图腾收藏卡</span>
              <span className="collector-star">✦</span>
            </div>

            <h1 className="totem-title">{totem.totem_name}</h1>
            <p className="totem-oneline">{totem.one_line}</p>

            <div className="totem-stage">
              <Image
                src={imageUrl}
                alt={totem.totem_name}
                width={260}
                height={260}
                className="totem-svg"
                unoptimized
              />
              <div className={`image-qc-pill image-qc-${quality?.status ?? result.image?.source}`}>
                {imageJob === "generating" ? <span className="mini-spinner" /> : null}
                {imageStatusText}
              </div>
            </div>

            <div className="story-callout">
              <span className="story-star">✦</span>
              {totem.safe_reframe || totem.positive_interpretation}
            </div>

            <div className="totem-story-block">
              <div className="label">图腾故事</div>
              <p>{totem.totem_story}</p>
            </div>

            <div className="chips">
              {visualKeywords.map((item) => (
                <span className="chip" key={item}>{item}</span>
              ))}
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flow-card">
            {/* AI 设计说明 */}
            <div className="panel panel-pad ai-design-card">
              <div className="section-heading">
                AI 设计说明
                <span className="section-star">✦</span>
              </div>
              <div className="insight-rows">
                {insightRows.map((row) => (
                  <div className="insight-row" key={row.label}>
                    <div className={`insight-icon ${row.colorClass}`}>{row.icon}</div>
                    <div className="insight-row-body">
                      <div className="insight-label">{row.label}</div>
                      <div className="insight-text">{row.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 选择商品 */}
            <div className="panel panel-pad product-section-panel">
              <div className="section-heading">
                选择你的图腾商品
                <span className="section-star">✦</span>
              </div>

              {isImageGenerating ? (
                <div className="product-wait-card">
                  <span className="mini-spinner" />
                  <strong>正在生成图腾图像</strong>
                  <p>图像完成后，系统会自动生成商品预览。</p>
                </div>
              ) : isImageFallback ? (
                <div className="product-wait-card">
                  <strong>图腾图像还没锁定</strong>
                  <p>为避免名字和图片不一致，当前不开放商品下单。</p>
                  <button className="button secondary" onClick={() => result && generateImage(result)}>重试生成图像</button>
                </div>
              ) : (
                <div className="product-grid-new">
                  {products.map((product) => (
                    <ProductCard
                      key={product.product_type}
                      product={product}
                      totemImageUrl={imageUrl}
                      onSelect={showProducts ? selectProduct : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
