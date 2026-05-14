import type { PrintFileSpec, ProductType } from "@/lib/types";

export function printFileSpecFor(productType: ProductType): PrintFileSpec {
  const common = {
    format: "PNG / 透明背景优先，演示阶段可用白底 PNG",
    resolution: "建议 1024px 以上，正式生产不低于 300dpi",
    color_mode: "RGB 预览，交厂前转 CMYK 色彩校对"
  };

  if (productType === "badge") {
    return {
      ...common,
      print_area: "58mm 圆形居中区域",
      safe_margin: "边缘保留 2mm 安全区",
      bleed: "外沿预留 1.5mm 出血",
      background: "建议透明底或奶白底"
    };
  }

  if (productType === "phone_case") {
    return {
      ...common,
      print_area: "手机壳背板中轴偏上区域",
      safe_margin: "摄像头与边缘保留 4mm 安全区",
      bleed: "四周预留 3mm 包边",
      background: "适配浅色 TPU 软壳"
    };
  }

  return {
    ...common,
    print_area: "80mm 异形贴纸主视觉区域",
    safe_margin: "图案外轮廓保留 2mm 白边",
    bleed: "刀线外扩 1.5mm",
    background: "白墨托底，覆膜异形切"
  };
}
