export const NEGATIVE_IMAGE_PROMPT =
  "no realistic human anatomy, no exposed body, no body shaming, no ugly expression, no horror, no medical illustration, no sexualized body, no photorealism, no messy background, no text, no logo, no watermark, no low quality, no dark or gloomy mood, no complex busy background";

type ImagePromptInput = {
  totem_name_en?: string;
  life_attitude?: string;
  visual_metaphor?: string;
  visual_keywords?: string[];
  safe_reframe?: string;
};

export function buildImagePrompt(totem: ImagePromptInput) {
  const name = totem.totem_name_en?.trim() || "Personal Totem";
  const attitude = totem.life_attitude?.trim() || "gentle self-acceptance and a warm personal rhythm";
  const metaphor = totem.visual_metaphor?.trim() || totem.safe_reframe?.trim() || "a symbolic lucky charm with a soft cloud, small star, and warm lantern";
  const keywords = totem.visual_keywords?.length ? totem.visual_keywords.join(", ") : "soft cloud, glowing star, warm lantern, rounded shapes, gentle kawaii";
  const meaning = totem.safe_reframe?.trim() || "a warm personal symbol full of self-acceptance and joy";

  return `Create a premium symbolic personal totem badge for BodyTotem.

Totem name:
${name}

Lifestyle attitude:
${attitude}

Visual metaphor:
${metaphor}

Character and symbols:
${keywords}

Emotional tone:
${meaning}

Style:
healing kawaii sticker style, modern vector illustration, soft rounded shapes, slightly eastern totem aesthetics, clean golden outline, centered badge composition, low-saturation pastel colors, premium product design quality, suitable for badges, phone cases, stickers and T-shirts.

Important constraints:
no realistic human body, no exposed body parts, no body shaming, no medical style, no sexualized body, no text, no logo, no watermark, no cluttered background.`;
}
