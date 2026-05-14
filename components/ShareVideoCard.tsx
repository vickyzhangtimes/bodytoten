"use client";

import { useRef, useState, useCallback } from "react";
import type { Totem } from "@/lib/types";

type Props = {
  totem: Totem;
  orderIdShort?: string;
};

const W = 540;
const H = 960;
const FPS = 30;
const DURATION_S = 5;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split("");
  const lines: string[] = [];
  let line = "";
  for (const char of words) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line.length > 0) {
      lines.push(line);
      line = char;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function ShareVideoCard({ totem, orderIdShort }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recording, setRecording] = useState(false);
  const [ready, setReady] = useState(false);
  const blobRef = useRef<Blob | null>(null);

  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, t: number) => {
      const p = t / (DURATION_S * FPS); // 0→1 overall progress

      // ── background gradient
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#0d0620");
      bg.addColorStop(0.5, "#1a0533");
      bg.addColorStop(1, "#0d0620");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── radial glow center
      const glowP = 0.5 + 0.5 * Math.sin(p * Math.PI * 2 * 1.5);
      const glow = ctx.createRadialGradient(W / 2, H * 0.38, 0, W / 2, H * 0.38, 260);
      glow.addColorStop(0, `rgba(139,92,246,${0.18 + 0.12 * glowP})`);
      glow.addColorStop(0.5, `rgba(236,72,153,${0.1 + 0.06 * glowP})`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // ── floating totem circle
      const totemP = Math.min(1, p * 3);
      const totemAlpha = easeOutCubic(totemP);
      const floatY = Math.sin(p * Math.PI * 2) * 10;
      const cx = W / 2;
      const cy = H * 0.36 + floatY;
      const r = 120 * easeOutCubic(Math.min(1, p * 4));

      // outer ring 1
      ctx.beginPath();
      ctx.arc(cx, cy, r + 28, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(139,92,246,${0.25 * totemAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // outer ring 2 (rotates)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(p * Math.PI * 2);
      ctx.beginPath();
      ctx.arc(0, 0, r + 14, 0, Math.PI * 1.6);
      ctx.strokeStyle = `rgba(236,72,153,${0.35 * totemAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // circle bg
      const circleBg = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      circleBg.addColorStop(0, "#2d1060");
      circleBg.addColorStop(1, "#1a0533");
      ctx.globalAlpha = totemAlpha;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = circleBg;
      ctx.fill();
      ctx.strokeStyle = "rgba(139,92,246,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // totem name initials inside circle
      ctx.globalAlpha = totemAlpha;
      ctx.font = `bold ${Math.round(r * 0.52)}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#a78bfa";
      ctx.fillText(totem.totem_name.slice(0, 2), cx, cy);
      ctx.globalAlpha = 1;

      // ── totem name
      const nameP = easeOutCubic(Math.min(1, Math.max(0, (p - 0.18) * 4)));
      ctx.globalAlpha = nameP;
      ctx.font = `bold 42px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const nameGrad = ctx.createLinearGradient(W / 2 - 100, 0, W / 2 + 100, 0);
      nameGrad.addColorStop(0, "#8b5cf6");
      nameGrad.addColorStop(0.5, "#ec4899");
      nameGrad.addColorStop(1, "#f59e0b");
      ctx.fillStyle = nameGrad;
      ctx.fillText(totem.totem_name, cx, H * 0.58);
      ctx.globalAlpha = 1;

      // ── caption text (positive_interpretation, wrapped)
      const captionP = easeOutCubic(Math.min(1, Math.max(0, (p - 0.3) * 3.5)));
      ctx.globalAlpha = captionP;
      ctx.font = `24px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(241,240,255,0.82)";
      const caption = totem.share_caption || totem.positive_interpretation;
      const lines = wrapText(ctx, caption, W - 80);
      const lineH = 36;
      const totalH = lines.length * lineH;
      const startY = H * 0.67 - totalH / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, cx, startY + i * lineH);
      });
      ctx.globalAlpha = 1;

      // ── keyword chips
      const chipsP = easeInOutQuad(Math.min(1, Math.max(0, (p - 0.5) * 3)));
      ctx.globalAlpha = chipsP;
      const chips = totem.visual_elements.slice(0, 4);
      const chipW = 96;
      const chipH = 30;
      const chipGap = 10;
      const totalChipW = chips.length * chipW + (chips.length - 1) * chipGap;
      const chipStartX = (W - totalChipW) / 2;
      const chipY = H * 0.78;
      ctx.font = `700 13px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textBaseline = "middle";
      chips.forEach((chip, i) => {
        const x = chipStartX + i * (chipW + chipGap);
        ctx.beginPath();
        ctx.roundRect(x, chipY, chipW, chipH, 999);
        ctx.fillStyle = "rgba(139,92,246,0.18)";
        ctx.fill();
        ctx.strokeStyle = "rgba(139,92,246,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#a78bfa";
        ctx.textAlign = "center";
        ctx.fillText(chip, x + chipW / 2, chipY + chipH / 2);
      });
      ctx.globalAlpha = 1;

      // ── brand footer
      const footerP = easeOutCubic(Math.min(1, Math.max(0, (p - 0.7) * 4)));
      ctx.globalAlpha = footerP * 0.55;
      ctx.font = `700 16px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = "#f1f0ff";
      ctx.fillText("BodyTotem 身体图腾所", cx, H - 32);
      if (orderIdShort) {
        ctx.font = `12px "PingFang SC", "Microsoft YaHei", sans-serif`;
        ctx.fillStyle = "rgba(241,240,255,0.4)";
        ctx.fillText(orderIdShort, cx, H - 14);
      }
      ctx.globalAlpha = 1;
    },
    [totem, orderIdShort]
  );

  async function recordVideo() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setRecording(true);
    setReady(false);
    blobRef.current = null;

    const ctx = canvas.getContext("2d")!;
    const stream = canvas.captureStream(FPS);
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm",
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      blobRef.current = new Blob(chunks, { type: "video/webm" });
      setRecording(false);
      setReady(true);
    };

    recorder.start();

    const totalFrames = DURATION_S * FPS;
    for (let frame = 0; frame <= totalFrames; frame++) {
      drawFrame(ctx, frame);
      await new Promise<void>((res) => requestAnimationFrame(() => res()));
    }

    recorder.stop();
  }

  function download() {
    if (!blobRef.current) return;
    const url = URL.createObjectURL(blobRef.current);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${totem.totem_name}-图腾.webm`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="panel panel-pad flow-card" style={{ alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Share Video</div>
          <h3 style={{ margin: 0 }}>生成图腾分享视频</h3>
        </div>
        <span className="badge">Canvas · WebM · 5s</span>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: "100%",
          maxWidth: 270,
          borderRadius: 16,
          border: "1px solid var(--border)",
          display: "block",
        }}
      />

      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        <button
          className="button secondary"
          style={{ flex: 1 }}
          onClick={recordVideo}
          disabled={recording}
        >
          {recording ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="loading-ring" style={{ width: 18, height: 18, borderWidth: 2 }} />
              录制中…
            </span>
          ) : "预览并录制"}
        </button>
        <button
          className="button"
          style={{ flex: 1 }}
          onClick={download}
          disabled={!ready}
        >
          {ready ? "下载视频" : "请先录制"}
        </button>
      </div>

      <p className="muted" style={{ margin: 0, fontSize: 12, textAlign: "center" }}>
        5 秒竖版 9:16 · 浏览器本地生成 · 无需服务器 · 可直接分享
      </p>
    </div>
  );
}
