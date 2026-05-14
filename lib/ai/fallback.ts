import type { ProductType } from "@/lib/types";

export const DEFAULT_PRODUCTS: ProductType[] = ["badge", "phone_case", "sticker"];

export const DEFAULT_VISUAL_KEYWORDS = ["柔软符号", "治愈徽章", "圆润线条", "低饱和色彩"];

export function fallbackPersonalizedSentence(defaultSentence: string) {
  return defaultSentence || "我把一点小情绪，做成了自己的图腾。";
}

export function fallbackCustomFields() {
  return {
    slug: "custom-soft-light-totem",
    totem_name: "柔光小印",
    totem_name_en: "Soft Light Totem",
    safe_reframe: "这是一枚把小情绪转译成温柔力量的个人图腾。",
    one_line: "我的小情绪，也可以变成一枚发光的符号。",
    personalized_sentence: "我的小情绪，也可以变成一枚发光的符号。",
    totem_story: "它提醒你，用更温柔的方式和自己相处，也允许自己以舒服的节奏出现。",
    visual_metaphor: "a soft glowing emblem that turns a small personal feeling into a gentle symbol",
    visual_keywords: DEFAULT_VISUAL_KEYWORDS,
    recommended_products: DEFAULT_PRODUCTS,
    safety_note: "不评价身体，不建议改变自己，只做积极转译。",
    share_copy: "我把一点小情绪，做成了自己的图腾。"
  };
}
