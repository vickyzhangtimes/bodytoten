import type { Totem } from "@/lib/types";
import { buildImagePrompt, NEGATIVE_IMAGE_PROMPT } from "@/lib/ai/generateImagePrompt";
import { safeProductTypes, safeSlug, safeText, safeTextArray } from "@/lib/ai/generateTotem";
import { fallbackCustomFields, fallbackPersonalizedSentence } from "@/lib/ai/fallback";
import { normalizeBrandTotemName } from "@/lib/ai/nameGuard";
import { CUSTOM_TOTEM_PROMPT, PERSONALIZED_COPY_PROMPT, REPAIR_PROMPT } from "@/lib/ai/prompts";
import { containsBannedWords, validateTotemOutput } from "@/lib/ai/safety";

type ChatJsonResult = {
  parsed: Record<string, unknown>;
  model: string;
  latencyMs: number;
};

type CustomTotemResult = {
  totem: Totem;
  model: string;
  latencyMs: number;
};

const fallbackModel = "mockData";

function stripJson(text: string) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function llmConfig() {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || process.env.STEP_API_KEY;
  const baseUrl =
    process.env.LLM_BASE_URL || process.env.OPENAI_BASE_URL || process.env.STEP_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.LLM_MODEL || process.env.OPENAI_MODEL || process.env.STEP_MODEL || "gpt-4o-mini";
  return { apiKey, baseUrl: baseUrl.replace(/\/$/, ""), model };
}

async function chatJson(systemPrompt: string, userPrompt: string, maxTokens = 500): Promise<ChatJsonResult | null> {
  const { apiKey, baseUrl, model } = llmConfig();
  if (!apiKey) return null;

  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.45,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    return {
      parsed: JSON.parse(stripJson(content)) as Record<string, unknown>,
      model,
      latencyMs: Date.now() - started
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function buildTotemFromParsed(parsed: Record<string, unknown>, userInput: string): Totem {
  const fallback = fallbackCustomFields();
  const visualKeywords = safeTextArray(parsed.visual_keywords, fallback.visual_keywords);
  const totemName = normalizeBrandTotemName(parsed.totem_name, userInput);
  const safeReframe = safeText(parsed.safe_reframe, fallback.safe_reframe);
  const oneLine = safeText(parsed.one_line, fallback.one_line);
  const visualMetaphor = safeText(parsed.visual_metaphor, fallback.visual_metaphor);
  const shareCopy = safeText(parsed.share_copy, fallback.share_copy);
  const lifeAttitude = safeText(parsed.life_attitude, "把在意转译成可以主动拥有的生活态度");

  return {
    slug: safeSlug(parsed.slug, fallback.slug),
    totem_name: totemName,
    totem_name_en: safeText(parsed.totem_name_en, fallback.totem_name_en),
    surface_concern: safeText(parsed.surface_concern, "用户主动表达的小烦恼"),
    hidden_emotion: safeText(parsed.hidden_emotion, "担心被评价，也希望被理解"),
    inner_need: safeText(parsed.inner_need, "希望获得更温柔的自我叙事"),
    life_attitude: lifeAttitude,
    visual_metaphor: visualMetaphor,
    safe_reframe: safeReframe,
    one_line: oneLine,
    personalized_sentence: oneLine,
    positive_interpretation: safeReframe,
    totem_story: safeText(parsed.totem_story, fallback.totem_story),
    visual_keywords: visualKeywords,
    visual_elements: visualKeywords,
    image_url: "",
    image_prompt: buildImagePrompt({
      totem_name_en: safeText(parsed.totem_name_en, fallback.totem_name_en),
      life_attitude: lifeAttitude,
      visual_metaphor: visualMetaphor,
      visual_keywords: visualKeywords,
      safe_reframe: safeReframe
    }),
    negative_prompt: NEGATIVE_IMAGE_PROMPT,
    recommended_products: safeProductTypes(parsed.recommended_products),
    safety_note: safeText(parsed.safety_note, fallback.safety_note),
    share_copy: shareCopy,
    share_caption: shareCopy
  };
}

async function repairTotemJson(
  original: Record<string, unknown>,
  userInput: string,
  tone: string,
  reason: string
): Promise<ChatJsonResult | null> {
  return chatJson(
    REPAIR_PROMPT,
    `原始用户输入：${userInput}
希望语气：${tone}
校验失败原因：${reason}
待修复 JSON：
${JSON.stringify(original, null, 2)}`,
    900
  );
}

export async function generatePresetPersonalizedSentence(userInput: string, defaultSentence: string) {
  const safeDefault = fallbackPersonalizedSentence(defaultSentence);

  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await chatJson(
      PERSONALIZED_COPY_PROMPT,
      `用户输入：${userInput}
请只生成一句温柔、积极、适合分享卡的短句。`,
      160
    );
    const sentence = result?.parsed.personalized_sentence;
    if (result && typeof sentence === "string" && sentence.trim() && !containsBannedWords(sentence)) {
      return { sentence: sentence.trim(), model: result.model, latencyMs: result.latencyMs };
    }
  }

  return { sentence: safeDefault, model: mockModelName(), latencyMs: 0 };
}

export async function generateCustomTotemWithLlm(userInput: string, tone: string): Promise<CustomTotemResult | null> {
  const result = await chatJson(
    CUSTOM_TOTEM_PROMPT,
    `用户输入：${userInput}
希望语气：${tone}
请生成一个新的 BodyTotem 图腾结构。`,
    900
  );

  if (!result) return null;

  let candidate = result.parsed;
  let validation = validateTotemOutput(candidate);

  if (!validation.ok) {
    const repaired = await repairTotemJson(candidate, userInput, tone, validation.reason || "totem output failed validation");
    if (!repaired) return null;
    candidate = repaired.parsed;
    validation = validateTotemOutput(candidate);
    if (!validation.ok) return null;

    return {
      totem: buildTotemFromParsed(candidate, userInput),
      model: repaired.model,
      latencyMs: result.latencyMs + repaired.latencyMs
    };
  }

  const serialized = JSON.stringify(candidate);
  if (containsBannedWords(serialized)) return null;

  return {
    totem: buildTotemFromParsed(candidate, userInput),
    model: result.model,
    latencyMs: result.latencyMs
  };
}

export function mockModelName() {
  return fallbackModel;
}
