"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { productTypeLabel } from "@/lib/mockData";

type Props = {
  product: Product;
  totemImageUrl: string;
  totemName: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function ProductConfirmModal({ product, totemImageUrl, totemName, onConfirm, onClose }: Props) {
  const templateClass: Record<Product["product_type"], string> = {
    badge: "product-template-badge",
    phone_case: "product-template-phone-case",
    sticker: "product-template-sticker",
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="关闭">✕</button>

        <div className="modal-preview">
          <div className={`product-shape modal-shape`}>
            <div className={`product-template ${templateClass[product.product_type]}`}>
              <div className="product-art-shell">
                <Image
                  src={totemImageUrl}
                  alt={product.product_name}
                  width={220}
                  height={220}
                  className="product-art"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="label">{productTypeLabel(product.product_type)}</div>
          <p className="modal-title">{product.product_name}</p>
          <p className="muted" style={{ margin: "2px 0 0", fontSize: 13 }}>
            {product.material} · {product.craft}
          </p>

          <dl className="modal-dl">
            <dt>图腾</dt>
            <dd>{totemName}</dd>
            <dt>价格</dt>
            <dd>¥{product.price}</dd>
            <dt>尺寸</dt>
            <dd>{product.size}</dd>
            <dt>交期</dt>
            <dd>{product.production_time}</dd>
          </dl>

          <div className="modal-actions">
            <button className="button secondary" onClick={onClose}>再看看</button>
            <button className="button" onClick={onConfirm}>确认下单</button>
          </div>
        </div>
      </div>
    </div>
  );
}
