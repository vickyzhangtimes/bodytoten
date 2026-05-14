import type { ProductType } from "./types";

export type ProductConfig = {
  displayName: string;
  price: number;
  size: string;
  material: string;
  craft: string;
  productionTime: string;
  package: string;
  factoryNote: string;
};

export const PRODUCT_CONFIG: Record<ProductType, ProductConfig> = {
  badge: {
    displayName: "徽章",
    price: 29,
    size: "58mm",
    material: "亚克力",
    craft: "UV打印 + 滴胶",
    productionTime: "72小时",
    package: "独立透明袋包装",
    factoryNote: "图案居中，边缘保留2mm安全区，适合小批量柔性生产。"
  },
  phone_case: {
    displayName: "手机壳",
    price: 59,
    size: "iPhone 演示款",
    material: "TPU软壳",
    craft: "UV打印",
    productionTime: "72小时",
    package: "独立透明袋包装",
    factoryNote: "图案置于手机壳中轴偏上位置，摄像头区域保留安全距离，适合演示款小批量生产。"
  },
  sticker: {
    displayName: "贴纸",
    price: 19,
    size: "80mm",
    material: "防水贴纸",
    craft: "覆膜异形切",
    productionTime: "48小时",
    package: "独立透明袋包装",
    factoryNote: "图案外沿预留2mm白边，异形刀线随图案外轮廓生成，适合贴纸套装扩展。"
  }
};

export const PRODUCT_TYPES = Object.keys(PRODUCT_CONFIG) as ProductType[];
