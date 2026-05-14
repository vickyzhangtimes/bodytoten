import type { ProductType } from "@/lib/types";
import { containsBannedWords } from "./safety";
import { DEFAULT_PRODUCTS, DEFAULT_VISUAL_KEYWORDS } from "./fallback";

const PRODUCT_TYPES: ProductType[] = ["badge", "phone_case", "sticker"];
const TEXT_LIKE_VISUAL_TERMS = ["字", "文字", "手写", "书法", "标语", "标签", "slogan", "text", "letter", "word"];

export function safeText(value: unknown, fallback: string) {
  const text = String(value || fallback).trim();
  return text && !containsBannedWords(text) ? text : fallback;
}

export function safeSlug(value: unknown, fallback: string) {
  const slug = String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || fallback;
}

export function safeTextArray(value: unknown, fallback = DEFAULT_VISUAL_KEYWORDS) {
  if (!Array.isArray(value)) return fallback;

  const arr = value
    .map((item) => String(item).trim())
    .filter((item) => item && !containsBannedWords(item))
    .filter((item) => !TEXT_LIKE_VISUAL_TERMS.some((term) => item.toLowerCase().includes(term)))
    .slice(0, 6);

  return arr.length ? arr : fallback;
}

export function safeProductTypes(value: unknown) {
  if (!Array.isArray(value)) return DEFAULT_PRODUCTS;

  const products = value
    .map(String)
    .filter((item): item is ProductType => PRODUCT_TYPES.includes(item as ProductType))
    .slice(0, 3);

  return products.length ? products : DEFAULT_PRODUCTS;
}
