import { NextResponse } from "next/server";
import { buildImagePrompt, NEGATIVE_IMAGE_PROMPT } from "@/lib/ai/generateImagePrompt";
import { fallbackQualityCheck, generatedQualityCheck } from "@/lib/ai/imageQuality";
import { validateImagePrompt } from "@/lib/ai/safety";
import { fallbackTotem, TOTEM_CATALOG } from "@/lib/totemCatalog";
import { loadSession, saveGeneratedImage, saveSession } from "@/lib/server/storage";

type GenerateImageRequest = {
  session_id?: string;
  slug?: string;
  image_prompt?: string;
  negative_prompt?: string;
  fallback_image_url?: string;
};

type ImageProvider = "openai" | "modelscope";

type GeneratedImage = {
  bytes: Buffer;
  extension: string;
  revisedPrompt?: string | null;
  taskId?: string | null;
};

export const runtime = "nodejs";

function imageConfig() {
  const requestedProvider = process.env.IMAGE_PROVIDER?.toLowerCase();
  const baseUrl = (
    process.env.IMAGE_BASE_URL ||
    process.env.MODELSCOPE_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    "https://api.openai.com/v1"
  ).replace(/\/$/, "");
  const provider: ImageProvider =
    requestedProvider === "modelscope" || baseUrl.includes("modelscope") ? "modelscope" : "openai";
  const apiKey = process.env.IMAGE_API_KEY || process.env.MODELSCOPE_API_KEY;
  const model =
    process.env.IMAGE_MODEL || process.env.MODELSCOPE_IMAGE_MODEL || (provider === "modelscope" ? "Tongyi-MAI/Z-Image-Turbo" : "gpt-image-1");
  return { apiKey, baseUrl, model, provider };
}

function fallbackResponse(fallbackImageUrl: string, reason: string) {
  const qualityCheck = fallbackQualityCheck(reason);
  return NextResponse.json({
    source: "placeholder",
    status: "fallback",
    image_url: fallbackImageUrl,
    generated_image_url: null,
    fallback_image_url: fallbackImageUrl,
    quality_check: qualityCheck,
    reason
  });
}

function imageEndpoint(baseUrl: string, endpoint: string) {
  const base = baseUrl.replace(/\/$/, "");
  if (base.endsWith("/v1") && endpoint.startsWith("/v1/")) {
    return `${base}${endpoint.slice(3)}`;
  }
  return `${base}${endpoint}`;
}

function extensionFromContentType(contentType: string, url = "") {
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("png")) return "png";
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  return match?.[1]?.toLowerCase() || "png";
}

async function responseError(response: Response, prefix: string) {
  const text = await response.text().catch(() => "");
  const detail = text ? ` ${text.slice(0, 240)}` : "";
  return `${prefix}: ${response.status}${detail}`;
}

async function delay(ms: number, signal: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new Error("aborted"));
      },
      { once: true }
    );
  });
}

async function bytesFromImageReference(reference: string, signal: AbortSignal): Promise<{ bytes: Buffer; extension: string }> {
  const dataUrl = reference.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (dataUrl) {
    return {
      bytes: Buffer.from(dataUrl[2], "base64"),
      extension: dataUrl[1].replace("jpeg", "jpg")
    };
  }

  const imageResponse = await fetch(reference, { signal });
  if (!imageResponse.ok) {
    throw new Error(`generated image download failed: ${imageResponse.status}`);
  }

  const contentType = imageResponse.headers.get("content-type") || "";
  return {
    bytes: Buffer.from(await imageResponse.arrayBuffer()),
    extension: extensionFromContentType(contentType, reference)
  };
}

async function generateWithOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string,
  signal: AbortSignal
): Promise<GeneratedImage> {
  const response = await fetch(`${baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    signal,
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: "1024x1024"
    })
  });

  if (!response.ok) {
    throw new Error(await responseError(response, "image API failed"));
  }

  const data = (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string; revised_prompt?: string }>;
  };
  const first = data.data?.[0];
  if (!first?.b64_json && !first?.url) {
    throw new Error("image API returned empty data");
  }

  if (first.b64_json) {
    return {
      bytes: Buffer.from(first.b64_json, "base64"),
      extension: "png",
      revisedPrompt: first.revised_prompt ?? null
    };
  }

  const downloaded = await bytesFromImageReference(first.url!, signal);
  return {
    ...downloaded,
    revisedPrompt: first.revised_prompt ?? null
  };
}

async function generateWithModelScope(
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string,
  signal: AbortSignal
): Promise<GeneratedImage> {
  const createResponse = await fetch(imageEndpoint(baseUrl, "/v1/images/generations"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-ModelScope-Async-Mode": "true"
    },
    signal,
    body: JSON.stringify({ model, prompt })
  });

  if (!createResponse.ok) {
    throw new Error(await responseError(createResponse, "modelscope create failed"));
  }

  const created = (await createResponse.json()) as {
    task_id?: string;
    id?: string;
    output_images?: string[];
    output?: { task_id?: string; output_images?: string[] };
  };
  const immediateImage = created.output_images?.[0] || created.output?.output_images?.[0];
  if (immediateImage) {
    return bytesFromImageReference(immediateImage, signal);
  }

  const taskId = created.task_id || created.output?.task_id || created.id;
  if (!taskId) {
    throw new Error("modelscope task_id missing");
  }

  for (let attempt = 0; attempt < 20; attempt++) {
    await delay(attempt === 0 ? 1500 : 3000, signal);

    const pollResponse = await fetch(imageEndpoint(baseUrl, `/v1/tasks/${taskId}`), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-ModelScope-Task-Type": "image_generation"
      },
      signal
    });

    if (!pollResponse.ok) {
      throw new Error(await responseError(pollResponse, "modelscope poll failed"));
    }

    const task = (await pollResponse.json()) as {
      task_status?: string;
      status?: string;
      output_images?: string[];
      output?: { output_images?: string[]; task_status?: string; status?: string };
    };
    const status = (task.task_status || task.status || task.output?.task_status || task.output?.status || "").toUpperCase();
    const image = task.output_images?.[0] || task.output?.output_images?.[0];

    if (image && ["SUCCEED", "SUCCESS", "COMPLETED", "DONE"].includes(status)) {
      const downloaded = await bytesFromImageReference(image, signal);
      return { ...downloaded, taskId };
    }

    if (["FAILED", "FAILURE", "CANCELED", "CANCELLED"].includes(status)) {
      throw new Error(`modelscope task failed: ${status}`);
    }
  }

  throw new Error(`modelscope task timed out: ${taskId}`);
}

async function updateSessionImage(sessionId: string | undefined, imageUrl: string, fallbackImageUrl: string) {
  if (!sessionId) return;
  const session = await loadSession(sessionId);
  if (!session) return;
  const qualityCheck = generatedQualityCheck("ai", imageUrl);
  await saveSession({
    ...session,
    status: "IMAGE_READY",
    totem: {
      ...session.totem,
      image_url: imageUrl
    },
    image: {
      source: "ai",
      status: "ready",
      image_url: imageUrl,
      generated_image_url: imageUrl,
      fallback_image_url: fallbackImageUrl,
      quality_check: qualityCheck
    }
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as GenerateImageRequest;
  const session = body.session_id ? await loadSession(body.session_id) : null;
  const matched = TOTEM_CATALOG.find((item) => item.slug === body.slug) ?? fallbackTotem();
  const fallbackImageUrl = body.fallback_image_url || session?.image.fallback_image_url || matched.imageUrl;
  const { apiKey, baseUrl, model, provider } = imageConfig();

  if (!apiKey) {
    return fallbackResponse(fallbackImageUrl, "IMAGE_API_KEY is not configured");
  }

  if (!body.session_id || !session) {
    return fallbackResponse(fallbackImageUrl, "missing or unknown session_id");
  }

  const sessionPromptValidation = validateImagePrompt(session.totem.image_prompt || "");
  const rebuiltImagePrompt = buildImagePrompt({
    totem_name_en: session.totem.totem_name_en,
    life_attitude: session.totem.life_attitude,
    visual_metaphor: session.totem.visual_metaphor || session.totem.safe_reframe,
    visual_keywords: session.totem.visual_keywords,
    safe_reframe: session.totem.safe_reframe
  });
  const finalImagePrompt = sessionPromptValidation.ok ? session.totem.image_prompt : rebuiltImagePrompt;
  const validation = validateImagePrompt(finalImagePrompt);
  if (!validation.ok) {
    return fallbackResponse(fallbackImageUrl, validation.reason || "image prompt failed validation");
  }

  const prompt = `${finalImagePrompt}

Negative constraints:
${session.totem.negative_prompt || body.negative_prompt || NEGATIVE_IMAGE_PROMPT}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 70000);

  try {
    const generated =
      provider === "modelscope"
        ? await generateWithModelScope(baseUrl, apiKey, model, prompt, controller.signal)
        : await generateWithOpenAICompatible(baseUrl, apiKey, model, prompt, controller.signal);

    if (generated.bytes.length < 1000) {
      return fallbackResponse(fallbackImageUrl, "generated image is too small");
    }

    const imageUrl = await saveGeneratedImage(body.session_id, generated.bytes, generated.extension);
    await updateSessionImage(body.session_id, imageUrl, fallbackImageUrl);
    const qualityCheck = generatedQualityCheck("ai", imageUrl);

    return NextResponse.json({
      source: "ai",
      image_url: imageUrl,
      generated_image_url: imageUrl,
      fallback_image_url: fallbackImageUrl,
      quality_check: qualityCheck,
      status: "ready",
      provider,
      model,
      task_id: generated.taskId ?? null,
      revised_prompt: generated.revisedPrompt ?? null
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "image generation failed";
    return fallbackResponse(fallbackImageUrl, reason);
  } finally {
    clearTimeout(timeout);
  }
}
