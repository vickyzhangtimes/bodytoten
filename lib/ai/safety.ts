import { CUSTOM_TOTEM_REQUIRED_FIELDS } from "./schemas";

export const BANNED_WORDS = [
  "胖",
  "丑",
  "弱点",
  "缺陷",
  "肥",
  "赘肉",
  "馋",
  "减肥",
  "变瘦",
  "矫正",
  "遮丑",
  "修复",
  "治疗"
];

export const BANNED_NAME_WORDS = ["胖", "丑", "弱点", "缺陷", "肥", "赘肉", "馋", "矮", "秃", "结巴", "痘", "修复", "治疗", "矫正", "遮丑"];

const TEXT_FIELDS = [
  "totem_name",
  "safe_reframe",
  "one_line",
  "totem_story",
  "personalized_sentence",
  "image_prompt",
  "negative_prompt",
  "share_copy",
  "safety_note"
];

export function containsBannedWords(text: string) {
  return BANNED_WORDS.some((word) => text.includes(word));
}

export function containsBannedNameWords(text: string) {
  return BANNED_NAME_WORDS.some((word) => text.includes(word));
}

export function validateTotemOutput(output: unknown) {
  if (!output || typeof output !== "object") {
    return { ok: false, reason: "output is not an object" };
  }

  const record = output as Record<string, unknown>;
  for (const field of CUSTOM_TOTEM_REQUIRED_FIELDS) {
    const value = record[field];
    if (field === "visual_keywords" || field === "recommended_products") {
      if (!Array.isArray(value) || value.length === 0) {
        return { ok: false, reason: `${field} must be a non-empty array` };
      }
    } else if (typeof value !== "string" || !value.trim()) {
      return { ok: false, reason: `${field} is required` };
    }
  }

  for (const field of TEXT_FIELDS) {
    const value = record[field];
    if (typeof value === "string" && containsBannedWords(value)) {
      return { ok: false, reason: `${field} contains banned words` };
    }
  }

  if (typeof record.totem_name === "string" && containsBannedNameWords(record.totem_name)) {
    return { ok: false, reason: "totem_name contains banned name words" };
  }

  const serialized = JSON.stringify(output);
  if (containsBannedWords(serialized)) {
    return { ok: false, reason: "output contains banned words" };
  }

  return { ok: true };
}

export function validateImagePrompt(prompt: string) {
  if (!prompt.trim()) return { ok: false, reason: "empty image prompt" };
  if (containsBannedWords(prompt)) return { ok: false, reason: "prompt contains banned words" };

  const lower = prompt.toLowerCase();
  const required = ["no text", "no logo", "no watermark"];
  const missing = required.filter((item) => !lower.includes(item));
  if (missing.length) {
    return { ok: false, reason: `prompt missing constraints: ${missing.join(", ")}` };
  }

  if (!lower.includes("badge") || !lower.includes("sticker")) {
    return { ok: false, reason: "prompt missing product suitability" };
  }

  return { ok: true };
}
