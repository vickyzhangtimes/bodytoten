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
  const bgClass: Record<Product["product_type"], string> = {
    badge: "pcard-bg-badge",
    phone_case: "pcard-bg-phone",
    sticker: "pcard-bg-sticker",
  };
  const imageUrl = totemImageUrl ?? "/mock/generic-totem-placeholder.svg";

  return (
    <article className={`pcard ${selected ? "selected" : ""} ${onSelect ? "is-selectable" : ""}`}>
      <div className={`pcard-img-wrap ${bgClass[product.product_type]}`}>
        <Image
          src={imageUrl}
          alt={`${product.product_name} design`}
          width={200}
          height={200}
          className="pcard-img"
          unoptimized
        />
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
