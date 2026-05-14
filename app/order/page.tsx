"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ShareCard } from "@/components/ShareCard";
import { StepBar } from "@/components/StepBar";
import { generateMockResponse } from "@/lib/mockData";
import { isCurrentResult, loadProduct, loadResult, saveOrder, saveProduct, saveResult } from "@/lib/storage";
import type { GenerateResponse, OrderResponse, Product } from "@/lib/types";
import { gradientToTheme, pickGradient } from "@/lib/coolhue";

export default function OrderPage() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let storedResult = loadResult();
    if (!isCurrentResult(storedResult)) {
      storedResult = generateMockResponse("我有一点小肚子，但我又很爱吃，拍照时总想遮住。");
      saveResult(storedResult);
    }
    let storedProduct = loadProduct();
    if (!storedProduct) {
      storedProduct = storedResult.products[0];
      saveProduct(storedProduct);
    }
    setResult(storedResult);
    setProduct(storedProduct);
    void submitOrder(storedResult, storedProduct);
  }, []);

  async function submitOrder(resultInput = result, productInput = product) {
    if (!resultInput || !productInput) return;
    setLoading(true);
    setError("");
    try {
      let response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: resultInput.session_id,
          product_type: productInput.product_type
        })
      });

      if (!response.ok) {
        response = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: resultInput.session_id,
            product: productInput,
            totem: resultInput.totem,
            image_url: resultInput.image?.image_url ?? resultInput.totem.image_url
          })
        });
      }

      if (!response.ok) throw new Error("order api failed");
      const data = (await response.json()) as OrderResponse;
      saveOrder(data);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "订单生成失败");
    } finally {
      setLoading(false);
    }
  }

  if (!result || !product) return null;
  const imageUrl = result.image?.image_url ?? result.totem.image_url;
  const shareLine = result.totem.share_copy || result.totem.share_caption || result.totem.positive_interpretation;

  const theme = gradientToTheme(pickGradient(result.totem.slug ?? result.totem.totem_name));
  const themeVars = {
    "--grad-btn": theme.btnGrad,
    "--border-active": theme.borderActive,
    "--purple": theme.accent,
    "--purple-end": theme.accentEnd,
    "--bg-grad": theme.bgGrad,
  } as React.CSSProperties;

  return (
    <main className="page" style={themeVars}>
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
          <span className="badge">模拟商业闭环</span>
        </div>
        <StepBar
          current={5}
          prevHref="/result"
          nextHref={order ? "/factory" : undefined}
          nextLabel="查看生产单"
          imageSource={result.image?.source}
          textLive={result.meta?.source === "llm"}
        />

        <section className="order-layout">
          <div className="order-side">
            <ProductCard product={product} selected totemImageUrl={imageUrl} />
            <div className="panel panel-pad order-proof">
              <div className="label">订单进度</div>
              <div className="order-proof-row">
                <span>图腾图</span>
                <strong>已锁定</strong>
              </div>
              <div className="order-proof-row">
                <span>商品 SKU</span>
                <strong>{product.product_type}</strong>
              </div>
              <div className="order-proof-row">
                <span>生产字段</span>
                <strong>{order ? "已生成" : "生成中"}</strong>
              </div>
              <div className="order-proof-row">
                <span>图像质检</span>
                <strong>{result.image.quality_check?.checks.production_ready ? "可生产" : "需复核"}</strong>
              </div>
            </div>
          </div>

          <div className="order-main">
            <div className={`panel panel-pad order-complete-card ${order ? "ready" : ""}`}>
              <div className="order-complete-head">
                <div className="success-mark">{order ? "✓" : "…"}</div>
                <div>
                  <div className="label">{order ? "下单成功" : "正在下单"}</div>
                  <h1>{order ? "订单已接收" : "正在生成订单"}</h1>
                  <p className="muted">
                    {order
                      ? "你的专属图腾商品正在制作中，生产单已经同步生成。"
                      : "正在把商品选择、图腾文件和生产参数写入模拟订单。"}
                  </p>
                </div>
              </div>

              <dl className="order-receipt">
                <dt>订单编号</dt>
                <dd>{order?.order_id ?? "生成中..."}</dd>
                <dt>图腾名称</dt>
                <dd>{result.totem.totem_name}</dd>
                <dt>商品名称</dt>
                <dd>{product.product_name}</dd>
                <dt>模拟价格</dt>
                <dd>¥{product.price}</dd>
                <dt>预计交付</dt>
                <dd>{order?.estimated_time ?? product.production_time}</dd>
                <dt>状态</dt>
                <dd>{order ? "生产单已生成" : "正在创建订单与生产单"}</dd>
              </dl>

              <div className="production-progress" aria-label="生产进度">
                {["订单确认", "AI 设计确认", "工厂制作中", "质检包装", "商品发货"].map((item, index) => (
                  <div className={index < 3 ? "done" : ""} key={item}>
                    <span>{index < 3 ? "✓" : index + 1}</span>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </div>

            <ShareCard
              totemName={result.totem.totem_name}
              totemSlug={result.totem.slug ?? result.totem.totem_name}
              totemOneLine={result.totem.one_line ?? result.totem.totem_story}
              shareLine={shareLine}
              imageUrl={imageUrl}
              tags={result.totem.visual_keywords ?? result.totem.visual_elements ?? []}
              productName={product.product_name}
              estimatedTime={order?.estimated_time ?? product.production_time}
            />

            {error ? <div className="error">{error}</div> : null}
            <div className="actions">
              {error ? (
                <button className="button secondary" onClick={() => submitOrder()} disabled={loading}>
                  {loading ? "生成中..." : "重试订单"}
                </button>
              ) : null}
              {order ? (
                <Link className="button" href="/factory">
                  查看工厂生产单
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
