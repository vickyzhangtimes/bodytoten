"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FactorySheet } from "@/components/FactorySheet";
import { ShareVideoCard } from "@/components/ShareVideoCard";
import { StepBar } from "@/components/StepBar";
import { fallbackQualityCheck } from "@/lib/ai/imageQuality";
import { generateMockResponse } from "@/lib/mockData";
import { printFileSpecFor } from "@/lib/productionSpec";
import { isCurrentResult, loadOrder, loadProduct, loadResult, saveOrder, saveProduct, saveResult } from "@/lib/storage";
import type { GenerateResponse, OrderResponse, Totem } from "@/lib/types";

export default function FactoryPage() {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [totem, setTotem] = useState<Totem | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  useEffect(() => {
    const storedResult = loadResult();
    if (isCurrentResult(storedResult)) {
      setResult(storedResult);
      setTotem(storedResult.totem);
    }

    const stored = loadOrder();
    if (stored?.production_sheet && stored?.selected_product) {
      setOrder(stored);
      if (!isCurrentResult(storedResult)) {
        const name = stored.selected_product.product_name.replace(/(徽章|手机壳|贴纸)$/, "");
        setTotem({
          slug: "recovered-totem",
          totem_name: name,
          totem_name_en: "Recovered Totem",
          surface_concern: "已恢复订单图腾",
          hidden_emotion: "希望保留自己的表达",
          inner_need: "继续完成商品闭环",
          life_attitude: "把表达变成可生产的商品",
          visual_metaphor: "一枚已锁定的个人图腾",
          safe_reframe: "这是你的专属图腾。",
          one_line: "这是你的专属图腾。",
          personalized_sentence: "这是你的专属图腾。",
          positive_interpretation: "这是你的专属图腾。",
          totem_story: "",
          visual_keywords: [],
          visual_elements: [],
          image_url: stored.production_sheet.design_file,
          image_prompt: "",
          negative_prompt: "",
          recommended_products: [],
          safety_note: "",
          share_copy: "我的专属图腾",
          share_caption: "我的专属图腾",
        });
      }
      return;
    }

    const fallbackResult = isCurrentResult(storedResult)
      ? storedResult
      : generateMockResponse("我有一点小肚子，但我又很爱吃，拍照时总想遮住。");
    saveResult(fallbackResult);
    setResult(fallbackResult);
    setTotem(fallbackResult.totem);
    const fallbackProduct = loadProduct() ?? fallbackResult.products[0];
    saveProduct(fallbackProduct);
    const fallbackOrder: OrderResponse = {
      order_id: "BT20260513-001",
      status: "模拟下单成功，生产单已生成",
      estimated_time: fallbackProduct.production_time,
      selected_product: fallbackProduct,
      production_sheet: {
        production_sheet_id: "PS20260513-001",
        order_id: "BT20260513-001",
        totem_name: fallbackResult.totem.totem_name,
        product_type: fallbackProduct.product_type,
        product_name: fallbackProduct.product_name,
        design_file: fallbackResult.image?.image_url ?? fallbackResult.totem.image_url,
        size: fallbackProduct.size,
        material: fallbackProduct.material,
        craft: fallbackProduct.craft,
        package: "独立透明袋包装",
        production_time: fallbackProduct.production_time,
        factory_note: "图案居中，边缘保留2mm安全区，适合小批量柔性生产。",
        print_file_spec: printFileSpecFor(fallbackProduct.product_type),
        quality_check: fallbackQualityCheck("factory fallback order"),
        risk_notes: ["避免身体羞辱文案", "不建议身体矫正", "保留用户主动表达语气"],
      },
    };
    saveOrder(fallbackOrder);
    setOrder(fallbackOrder);
  }, []);

  if (!order || !totem) return null;

  return (
    <main className="page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="shell app-frame">
        <div className="topbar">
          <a className="brand" href="/"><span className="mark-dot" />BodyTotem</a>
          <nav className="nav-links" aria-label="流程导航">
            <a href="/#totems">图腾样例</a>
            <a href="/#demo">Demo 闭环</a>
            <a href="/#how">如何工作</a>
          </nav>
          <span className="badge">生产单已生成</span>
        </div>
        <StepBar
          current={6}
          prevHref="/order"
          nextHref="/create"
          nextLabel="再生成一个"
          imageSource={result?.image?.source ?? "mock"}
          textLive={result?.meta?.source === "llm"}
        />

        <section className="grid-2">
          <FactorySheet sheet={order.production_sheet} />

          <div className="flow-card">
            <div className="panel panel-pad flow-card factory-summary-card">
              <div className="label">订单详情</div>
              <h1 className="factory-order-title">{order.order_id}</h1>
              <dl>
                <dt>状态</dt>
                <dd>{order.status}</dd>
                <dt>图腾</dt>
                <dd>{totem.totem_name}</dd>
                <dt>预计生产</dt>
                <dd>{order.estimated_time}</dd>
                <dt>商品</dt>
                <dd>{order.selected_product.product_name}</dd>
              </dl>
            </div>

            <ShareVideoCard totem={totem} orderIdShort={order.order_id} />

            <Link className="button" href="/create">再生成一个图腾</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
