import type { GenerateResponse, Product, ProductType } from "./types";
import { fallbackQualityCheck } from "./ai/imageQuality";
import { productsForTotem } from "./productCatalog";
import { catalogItemToTotem, findPresetTotem, fallbackTotem, TOTEM_CATALOG } from "./totemCatalog";

export const mockCases = TOTEM_CATALOG.map((item) => ({
  keyword: item.aliases[0],
  sessionId: `bt_${item.slug.replace(/-/g, "_")}`,
  totemName: item.name,
  image: item.imageUrl
}));

export function defaultProducts(totemName: string): Product[] {
  return productsForTotem(totemName);
}

export function generateMockResponse(userInput: string): GenerateResponse {
  const selected = findPresetTotem(userInput) ?? fallbackTotem();
  const totem = catalogItemToTotem(selected);
  const imageReady = selected.imageStatus === "ready";
  return {
    session_id: `bt_${selected.slug.replace(/-/g, "_")}`,
    status: imageReady ? "IMAGE_READY" : "TEXT_READY",
    user_input: userInput,
    mode: "preset",
    matched_slug: selected.slug,
    confidence: findPresetTotem(userInput) ? 0.95 : 0.62,
    totem,
    image: {
      source: imageReady ? "mock" : "placeholder",
      status: imageReady ? "ready" : "needs_generation",
      image_url: selected.imageUrl,
      generated_image_url: null,
      fallback_image_url: selected.imageUrl,
      quality_check: fallbackQualityCheck("mock demo response")
    },
    products: defaultProducts(selected.name),
    meta: {
      source: "mock",
      model: "mockData",
      latency_ms: 0,
      fallback: true,
      fallback_reason: "mock demo response"
    }
  };
}

export function productTypeLabel(productType: ProductType): string {
  const labels: Record<ProductType, string> = {
    badge: "徽章",
    phone_case: "手机壳",
    sticker: "贴纸"
  };
  return labels[productType];
}
