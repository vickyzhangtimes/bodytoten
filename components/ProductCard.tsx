import Image from "next/image";
import type { Product } from "@/lib/types";
import { productTypeLabel } from "@/lib/mockData";

type ProductCardProps = {
  product: Product;
  selected?: boolean;
  totemImageUrl?: string;
  onSelect?: (product: Product) => void;
};

export function ProductCard({ product, selected, totemImageUrl, onSelect }: ProductCardProps) {
  const imageUrl = totemImageUrl ?? "/mock/generic-totem-placeholder.svg";
  const productLabel = productTypeLabel(product.product_type);

  return (
    <article className={`pcard pcard-${product.product_type} ${selected ? "selected" : ""} ${onSelect ? "is-selectable" : ""}`}>
      <div className="pcard-img-wrap">
        <span className="pcard-kind">{productLabel}</span>
        <div className={`pcard-mockup pcard-mockup-${product.product_type}`} aria-label={`${productLabel}预览`}>
          <div className="pcard-product-shell">
            <Image
              src={imageUrl}
              alt={`${product.product_name} design`}
              width={220}
              height={220}
              className="pcard-img"
              unoptimized
            />
          </div>
        </div>
      </div>
      <div className="pcard-body">
        <div className="pcard-name-row">
          <span className="pcard-name">{product.product_name}</span>
          <span className="pcard-price">¥{product.price}</span>
        </div>
        <p className="pcard-material">{product.material} · {product.craft}</p>
        <div className="pcard-meta">
          <span className="pcard-time-icon">🕐</span>
          <span className="pcard-time">预计制作 {product.production_time}</span>
        </div>
      </div>
      {onSelect ? (
        <button
          className="button pcard-btn"
          onClick={() => onSelect(product)}
          aria-label={`选择${product.product_name}并下单`}
        >
          选择并下单
        </button>
      ) : null}
    </article>
  );
}
