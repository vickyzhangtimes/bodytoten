import { NextResponse } from "next/server";
import { productionQualityCheck } from "@/lib/ai/imageQuality";
import { productByType } from "@/lib/productCatalog";
import { PRODUCT_CONFIG } from "@/lib/productConfig";
import { printFileSpecFor } from "@/lib/productionSpec";
import { makeOrderId, makeProductionSheetId } from "@/lib/server/ids";
import { loadSession, saveOrder, saveSession } from "@/lib/server/storage";
import type { Product, ProductType, Totem } from "@/lib/types";

type OrderRequest = {
  session_id?: string;
  product_type?: ProductType;
  product?: Product;
  totem?: Totem;
  image_url?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as OrderRequest;
  let product = body.product;
  let totem = body.totem;
  let sessionId = body.session_id;
  let designFile = body.image_url ?? body.totem?.image_url;
  let qualityCheck = undefined;

  if (body.session_id && body.product_type) {
    const session = await loadSession(body.session_id);
    if (!session) {
      return NextResponse.json({ error: "session not found" }, { status: 404 });
    }
    sessionId = session.session_id;
    totem = session.totem;
    designFile = body.image_url ?? session.image?.image_url ?? session.totem.image_url;
    qualityCheck = session.image?.quality_check;
    product = productByType(session.totem.totem_name, body.product_type) ?? undefined;
  }

  if (!product || !totem) {
    return NextResponse.json({ error: "missing product or totem" }, { status: 400 });
  }

  const orderId = makeOrderId();
  const config = PRODUCT_CONFIG[product.product_type];
  const productionQc = productionQualityCheck(qualityCheck);
  const order = {
    order_id: orderId,
    status: "模拟下单成功，生产单已生成",
    estimated_time: product.production_time,
    selected_product: product,
    session_id: sessionId,
    production_sheet: {
      production_sheet_id: makeProductionSheetId(),
      order_id: orderId,
      totem_name: totem.totem_name,
      product_type: product.product_type,
      product_name: product.product_name,
      design_file: designFile ?? totem.image_url,
      size: product.size,
      material: product.material,
      craft: product.craft,
      package: config.package,
      production_time: product.production_time,
      factory_note: config.factoryNote,
      print_file_spec: printFileSpecFor(product.product_type),
      quality_check: productionQc,
      risk_notes: [
        "避免身体羞辱文案",
        "不建议身体矫正",
        "保留用户主动表达语气",
        productionQc.checks.production_ready ? "图像可进入生产打样" : "AI 生图需复核文字、水印、logo 和奇怪拼写"
      ]
    }
  };

  await saveOrder(order);
  if (sessionId) {
    const session = await loadSession(sessionId);
    if (session) {
      await saveSession({ ...session, status: "PRODUCTION_SHEET_CREATED" });
    }
  }
  return NextResponse.json(order);
}
