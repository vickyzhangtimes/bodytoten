import type { Product, ProductType } from "./types";
import { PRODUCT_CONFIG, PRODUCT_TYPES } from "./productConfig";

export function productsForTotem(totemName: string): Product[] {
  return PRODUCT_TYPES.map((productType) => productForTotem(totemName, productType));
}

export function productForTotem(totemName: string, productType: ProductType): Product {
  const config = PRODUCT_CONFIG[productType];
  return {
    product_type: productType,
    product_name: `${totemName}${config.displayName}`,
    price: config.price,
    production_time: config.productionTime,
    material: config.material,
    craft: config.craft,
    size: config.size
  };
}

export function productByType(totemName: string, productType: ProductType): Product | null {
  return PRODUCT_CONFIG[productType] ? productForTotem(totemName, productType) : null;
}
