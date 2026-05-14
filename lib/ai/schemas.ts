import type { ProductType } from "@/lib/types";

export type CustomTotemSchema = {
  slug: string;
  totem_name: string;
  totem_name_en: string;
  surface_concern: string;
  hidden_emotion: string;
  inner_need: string;
  life_attitude: string;
  user_need_summary: string;
  safe_reframe: string;
  one_line: string;
  totem_story: string;
  visual_metaphor: string;
  visual_keywords: string[];
  color_palette?: string[];
  image_prompt?: string;
  negative_prompt?: string;
  recommended_products: ProductType[];
  share_copy: string;
  safety_note: string;
};

export const CUSTOM_TOTEM_REQUIRED_FIELDS: Array<keyof CustomTotemSchema> = [
  "slug",
  "totem_name",
  "totem_name_en",
  "surface_concern",
  "hidden_emotion",
  "inner_need",
  "life_attitude",
  "safe_reframe",
  "one_line",
  "totem_story",
  "visual_metaphor",
  "visual_keywords",
  "recommended_products",
  "share_copy",
  "safety_note"
];
