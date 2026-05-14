import { NextResponse } from "next/server";
import { fallbackQualityCheck } from "@/lib/ai/imageQuality";
import { productsForTotem } from "@/lib/productCatalog";
import { makeId } from "@/lib/server/ids";
import { generateCustomTotemWithLlm, generatePresetPersonalizedSentence, mockModelName } from "@/lib/server/llm";
import { GENERIC_TOTEM_PLACEHOLDER, catalogItemToTotem, fallbackTotem, findPresetTotem } from "@/lib/totemCatalog";
import type { GenerateResponse } from "@/lib/types";
import { saveSession } from "@/lib/server/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { user_input?: string; tone?: string };
  const userInput = body.user_input?.trim() || "我有一点小肚子，但我很爱吃";
  const tone = body.tone?.trim() || "温柔、有趣、有一点力量";
  const started = Date.now();
  const sessionId = makeId("bt");

  const preset = findPresetTotem(userInput);

  if (preset) {
    const personalized = await generatePresetPersonalizedSentence(userInput, preset.safeReframe);
    const totem = catalogItemToTotem(preset, personalized.sentence);
    const imageReady = preset.imageStatus === "ready";
    const session: GenerateResponse = {
      session_id: sessionId,
      status: imageReady ? "IMAGE_READY" : "TEXT_READY",
      user_input: userInput,
      mode: "preset",
      matched_slug: preset.slug,
      confidence: 0.95,
      totem,
      image: {
        source: imageReady ? "mock" : "placeholder",
        status: imageReady ? "ready" : "needs_generation",
        image_url: preset.imageUrl,
        generated_image_url: null,
        fallback_image_url: preset.imageUrl,
        quality_check: fallbackQualityCheck(
          imageReady
            ? "preset mode starts with official totem asset"
            : "preset matched official IP; image generation required"
        )
      },
      products: productsForTotem(preset.name),
      meta: {
        source: personalized.model === mockModelName() ? "mock" : "llm",
        model: personalized.model,
        latency_ms: personalized.latencyMs || Date.now() - started,
        fallback: personalized.model === mockModelName(),
        fallback_reason: personalized.model === mockModelName() ? "preset default sentence used" : undefined
      }
    };

    await saveSession(session);
    return NextResponse.json(session);
  }

  const custom = await generateCustomTotemWithLlm(userInput, tone);
  const fallback = fallbackTotem();
  const baseTotem = custom?.totem ?? catalogItemToTotem(fallback);
  const imageUrl = custom ? GENERIC_TOTEM_PLACEHOLDER : fallback.imageUrl;

  const session: GenerateResponse = {
    session_id: sessionId,
    status: custom ? "TEXT_READY" : "IMAGE_READY",
    user_input: userInput,
    mode: custom ? "custom" : "preset",
    matched_slug: custom ? null : fallback.slug,
    confidence: custom ? 0.42 : 0.6,
    totem: {
      ...baseTotem,
      image_url: imageUrl
    },
    image: {
      source: custom ? "placeholder" : "mock",
      status: custom ? "needs_generation" : "ready",
      image_url: imageUrl,
      generated_image_url: null,
      fallback_image_url: imageUrl,
      quality_check: fallbackQualityCheck(custom ? "custom text generated; image generation pending" : "custom generation fallback used")
    },
    products: productsForTotem(baseTotem.totem_name),
    meta: {
      source: custom ? "llm" : "mock",
      model: custom?.model ?? mockModelName(),
      latency_ms: custom?.latencyMs ?? Date.now() - started,
      fallback: !custom,
      fallback_reason: custom ? undefined : "custom generation failed safety check; preset fallback used"
    }
  };

  await saveSession(session);
  return NextResponse.json(session);
}
