import type { GenerateResponse, OrderResponse, Product } from "./types";

const RESULT_KEY = "bodytotem.result";
const PRODUCT_KEY = "bodytotem.product";
const ORDER_KEY = "bodytotem.order";

export function saveResult(result: GenerateResponse) {
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function loadResult(): GenerateResponse | null {
  const raw = window.localStorage.getItem(RESULT_KEY);
  return raw ? (JSON.parse(raw) as GenerateResponse) : null;
}

export function isCurrentResult(result: GenerateResponse | null): result is GenerateResponse {
  const isLegacyCustomPlaceholder =
    result?.mode === "custom" &&
    result?.image?.source === "ai" &&
    typeof result.image.image_url === "string" &&
    result.image.image_url.endsWith(".svg");
  const hasUnsafeCustomName =
    result?.mode === "custom" &&
    typeof result?.totem?.totem_name === "string" &&
    (/[钩刺疤裂丧病痛丑肥怪鬼怂废掌手脚腿脸肚腰腹镇]/.test(result.totem.totem_name) ||
      ["情心章", "钩金光", "掌镇星"].includes(result.totem.totem_name));

  if (isLegacyCustomPlaceholder || hasUnsafeCustomName) return false;

  return Boolean(
    result?.mode &&
      result?.image?.image_url &&
      result?.totem?.slug &&
      result?.totem?.totem_name &&
      Array.isArray(result?.products)
  );
}

export function saveProduct(product: Product) {
  window.localStorage.setItem(PRODUCT_KEY, JSON.stringify(product));
}

export function loadProduct(): Product | null {
  const raw = window.localStorage.getItem(PRODUCT_KEY);
  return raw ? (JSON.parse(raw) as Product) : null;
}

export function saveOrder(order: OrderResponse) {
  window.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function loadOrder(): OrderResponse | null {
  const raw = window.localStorage.getItem(ORDER_KEY);
  return raw ? (JSON.parse(raw) as OrderResponse) : null;
}
