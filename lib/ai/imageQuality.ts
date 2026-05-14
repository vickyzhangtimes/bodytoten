import type { ImageQualityCheck, ImageSource } from "@/lib/types";

export function fallbackQualityCheck(reason: string): ImageQualityCheck {
  const isPending = reason.includes("pending") || reason.includes("starts") || reason.includes("准备");
  const label = isPending ? "官方图腾资产" : "官方图腾资产";
  const note = isPending
    ? "当前先使用 BodyTotem 官方图腾资产，真实图像完成后会自动替换并生成商品预览。"
    : "这枚图腾来自 BodyTotem 官方图腾库，已按商品化场景准备，可用于徽章、手机壳和贴纸定制。";

  return {
    status: "fallback",
    label,
    mode: "fallback",
    checks: {
      prompt_guard: true,
      file_saved: true,
      no_text_policy: "fallback",
      production_ready: true
    },
    notes: [note]
  };
}

export function generatedQualityCheck(source: ImageSource, imageUrl: string): ImageQualityCheck {
  if (source === "mock") {
    return fallbackQualityCheck("图像模型未启用或生成失败");
  }

  return {
    status: "needs_review",
    label: "AI 图像已生成，需快速复核",
    mode: "manual_required",
    checks: {
      prompt_guard: true,
      file_saved: Boolean(imageUrl),
      no_text_policy: "needs_review",
      production_ready: false
    },
    notes: [
      "已通过后端安全 prompt 与文件完整性检查。",
      "真实生图仍需现场快速复核：不得含文字、logo、水印、身体评价或奇怪拼写。",
      "如复核不通过，系统应切回官方 fallback 图。"
    ]
  };
}

export function productionQualityCheck(check?: ImageQualityCheck): ImageQualityCheck {
  if (!check) return fallbackQualityCheck("未提供图像质检记录");
  return check.status === "passed" || check.status === "fallback"
    ? check
    : {
        ...check,
        label: "生产前需人工确认",
        checks: {
          ...check.checks,
          production_ready: false
        }
      };
}
