import Link from "next/link";
import type { ImageSource } from "@/lib/types";

type StepBarProps = {
  current: number;
  textLive?: boolean;
  imageSource?: ImageSource;
  imageBusy?: boolean;
  prevHref?: string;
  nextHref?: string;
  nextLabel?: string;
};

const STEPS = [
  { label: "写下小烦恼", href: "/create" },
  { label: "AI 情绪转译", href: "/result" },
  { label: "生成图腾", href: "/result" },
  { label: "商品预览", href: "/result" },
  { label: "模拟下单", href: "/order" },
  { label: "工厂生产单", href: "/factory" },
];

export function StepBar({
  current,
  textLive = true,
  imageSource = "mock",
  imageBusy = false,
  prevHref,
  nextHref,
  nextLabel = "下一步",
}: StepBarProps) {
  const imageStatus = imageBusy ? "Generating" : imageSource === "ai" ? "Live" : imageSource === "placeholder" ? "Pending" : "Mock fallback";

  return (
    <div className="flow-shell">
      <div className="flow-nav" aria-label="页面导航">
        <div className="flow-nav-left">
          <Link className="flow-link" href="/">首页</Link>
          {prevHref ? <Link className="flow-link" href={prevHref}>上一步</Link> : null}
        </div>
        {nextHref ? (
          <Link className="flow-link flow-link-primary" href={nextHref}>{nextLabel}</Link>
        ) : null}
      </div>

      <div className="steps">
        {STEPS.map((item, index) => {
          const step = index + 1;
          const state = step < current ? "done" : step === current ? "active" : "";
          const stepContent = (
            <>
              <span className="step-index">{step < current ? "✓" : step}</span>
              <span>{item.label}</span>
            </>
          );

          if (step <= current) {
            return (
              <Link className={`step ${state}`} href={item.href} key={item.label}>
                {stepContent}
              </Link>
            );
          }

          return (
            <div className={`step ${state}`} key={item.label} aria-disabled="true">
              {stepContent}
            </div>
          );
        })}
      </div>

      <div className="system-status" aria-label="系统状态">
        <span>文案 AI: {textLive ? "Live" : "Fallback"}</span>
        <span>图像: {imageStatus}</span>
        <span>商品: Template</span>
        <span>订单: Simulated</span>
      </div>
    </div>
  );
}
