export type ProductType = "badge" | "phone_case" | "sticker";
export type GenerateMode = "preset" | "custom";
export type ImageSource = "mock" | "ai" | "placeholder";
export type ImageAssetStatus = "ready" | "needs_generation" | "placeholder" | "fallback";
export type ImageQualityStatus = "passed" | "needs_review" | "fallback" | "failed";
export type SessionStatus =
  | "CREATED"
  | "TEXT_GENERATING"
  | "TEXT_READY"
  | "IMAGE_GENERATING"
  | "IMAGE_READY"
  | "MOCKUP_READY"
  | "ORDER_CREATED"
  | "PRODUCTION_SHEET_CREATED";

export type Totem = {
  slug: string;
  totem_name: string;
  totem_name_en: string;
  surface_concern: string;
  hidden_emotion: string;
  inner_need: string;
  life_attitude: string;
  visual_metaphor: string;
  safe_reframe: string;
  one_line: string;
  personalized_sentence: string;
  positive_interpretation: string;
  totem_story: string;
  visual_keywords: string[];
  visual_elements: string[];
  image_url: string;
  image_prompt: string;
  negative_prompt: string;
  recommended_products: ProductType[];
  safety_note: string;
  share_copy: string;
  share_caption: string;
};

export type GenerateMeta = {
  source: "llm" | "mock";
  model: string;
  latency_ms: number;
  fallback: boolean;
  fallback_reason?: string;
};

export type Product = {
  product_type: ProductType;
  product_name: string;
  price: number;
  production_time: string;
  material: string;
  craft: string;
  size: string;
};

export type ImageQualityCheck = {
  status: ImageQualityStatus;
  label: string;
  mode: "prompt_guard" | "fallback" | "manual_required";
  checks: {
    prompt_guard: boolean;
    file_saved: boolean;
    no_text_policy: "enforced" | "needs_review" | "fallback";
    production_ready: boolean;
  };
  notes: string[];
};

export type PrintFileSpec = {
  format: string;
  resolution: string;
  color_mode: string;
  print_area: string;
  safe_margin: string;
  bleed: string;
  background: string;
};

export type GenerateResponse = {
  session_id: string;
  status: SessionStatus;
  user_input: string;
  mode: GenerateMode;
  matched_slug: string | null;
  confidence: number;
  totem: Totem;
  image: {
    source: ImageSource;
    status: ImageAssetStatus;
    image_url: string;
    generated_image_url: string | null;
    fallback_image_url: string;
    quality_check?: ImageQualityCheck;
  };
  products: Product[];
  meta?: GenerateMeta;
};

export type ProductionSheet = {
  production_sheet_id: string;
  order_id?: string;
  totem_name?: string;
  product_type: ProductType;
  product_name?: string;
  design_file: string;
  size: string;
  material: string;
  craft: string;
  package: string;
  production_time: string;
  factory_note: string;
  print_file_spec?: PrintFileSpec;
  quality_check?: ImageQualityCheck;
  risk_notes: string[];
};

export type OrderResponse = {
  order_id: string;
  status: string;
  estimated_time: string;
  selected_product: Product;
  production_sheet: ProductionSheet;
  session_id?: string;
};
