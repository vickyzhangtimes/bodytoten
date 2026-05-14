"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gradientToCss, pickGradient } from "@/lib/coolhue";

type Props = {
  totemName: string;
  totemSlug: string;
  totemOneLine: string;
  shareLine: string;
  imageUrl: string;
  tags: string[];
  productName: string;
  estimatedTime: string;
};

export function ShareCard({ totemName, totemSlug, totemOneLine, shareLine, imageUrl, tags, productName, estimatedTime }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const gradient = pickGradient(totemSlug || totemName);
  const bgCss = `radial-gradient(ellipse 90% 70% at 50% 0%, ${gradient.start}38 0%, transparent 55%), radial-gradient(ellipse 70% 55% at 90% 100%, ${gradient.end}30 0%, transparent 60%), linear-gradient(180deg, #0e0720 0%, #090616 60%, #120822 100%)`;
  const glowCss = `0 0 0 1px ${gradient.start}22 inset, 0 0 80px ${gradient.start}44, 0 0 160px ${gradient.end}28, 0 32px 80px rgba(0,0,0,.6)`;
  const imgGlowCss = `0 0 50px ${gradient.start}77, 0 0 100px ${gradient.end}44`;
  const btnCss = gradientToCss(gradient);

  async function exportCard(action: "save" | "share") {
    if (!cardRef.current) return;
    setSaving(true);

    try {
      const dataUrl = await cardToCanvas(cardRef.current);

      if (action === "save") {
        const link = document.createElement("a");
        link.download = `bodytotem-${totemName}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const blob = await fetch(dataUrl).then(r => r.blob());
        const file = new File([blob], `bodytotem-${totemName}.png`, { type: "image/png" });
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `我的图腾：${totemName}` });
        } else {
          await navigator.clipboard.writeText(`我的图腾是「${totemName}」\n${totemOneLine}\n— BodyTotem 身体图腾所`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="share-card-section">
      <div className="totem-id-card" ref={cardRef} style={{ boxShadow: glowCss }}>
        <div className="totem-id-bg" style={{ background: bgCss }} />
        {/* 底部渐隐 */}
        <div style={{ position: "absolute", inset: "60% 0 0", background: `linear-gradient(0deg, ${gradient.end}14, transparent)`, pointerEvents: "none", zIndex: 2 }} />
        <div className="totem-id-inner">
          <div className="totem-id-brand">BodyTotem 身体图腾所</div>

          <div className="totem-id-img-wrap" style={{ borderColor: `${gradient.start}55`, boxShadow: imgGlowCss }}>
            <Image
              src={imageUrl}
              alt={totemName}
              width={170}
              height={170}
              className="totem-id-img"
              unoptimized
              crossOrigin="anonymous"
            />
          </div>

          <div className="totem-id-name" style={{ background: `linear-gradient(135deg, #fff 0%, ${gradient.start} 45%, ${gradient.end} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{totemName}</div>
          <div className="totem-id-oneline">{totemOneLine}</div>

          <div className="totem-id-divider" style={{ background: `linear-gradient(90deg, transparent, ${gradient.start}aa, transparent)` }} />

          <div className="totem-id-quote">"{shareLine}"</div>

          <div className="totem-id-tags">
            {tags.slice(0, 4).map(t => (
              <span className="totem-id-tag" key={t} style={{ background: `${gradient.start}1a`, border: `1px solid ${gradient.start}44`, color: gradient.start }}>{t}</span>
            ))}
          </div>

          <div className="totem-id-meta">
            <span>{productName}</span>
            <span className="totem-id-dot">·</span>
            <span>{estimatedTime} 后抵达</span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="share-card-actions">
        <button
          className="button"
          style={{ background: btnCss }}
          onClick={() => exportCard("save")}
          disabled={saving}
        >
          {saving ? "生成中…" : "保存图片"}
        </button>
        <button
          className="button secondary"
          onClick={() => exportCard("share")}
          disabled={saving}
        >
          {copied ? "文字已复制" : "分享"}
        </button>
      </div>
    </div>
  );
}

// 纯 Canvas fallback（不依赖 html-to-image）
async function cardToCanvas(el: HTMLElement): Promise<string> {
  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = el.offsetWidth * scale;
  canvas.height = el.offsetHeight * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  // 背景渐变
  const grad = ctx.createLinearGradient(0, 0, el.offsetWidth, el.offsetHeight);
  grad.addColorStop(0, "#1a0d3d");
  grad.addColorStop(0.5, "#0f0b1f");
  grad.addColorStop(1, "#2d0a2e");
  ctx.fillStyle = grad;
  ctx.roundRect(0, 0, el.offsetWidth, el.offsetHeight, 24);
  ctx.fill();

  // 尝试加载图片
  const imgEl = el.querySelector("img") as HTMLImageElement | null;
  if (imgEl) {
    try {
      const img = await loadImage(imgEl.src);
      const cx = el.offsetWidth / 2;
      const size = 160;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, 100 + size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, cx - size / 2, 100, size, size);
      ctx.restore();
    } catch {}
  }

  // 文字
  const cx = el.offsetWidth / 2;
  ctx.textAlign = "center";
  ctx.fillStyle = "#F6F1FF";
  ctx.font = "bold 32px Inter, sans-serif";
  ctx.fillText(el.querySelector(".totem-id-name")?.textContent ?? "", cx, 310);
  ctx.font = "16px Inter, sans-serif";
  ctx.fillStyle = "rgba(241,240,255,.72)";
  ctx.fillText(el.querySelector(".totem-id-oneline")?.textContent ?? "", cx, 340);

  return canvas.toDataURL("image/png");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
