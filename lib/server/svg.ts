import type { Totem } from "@/lib/types";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paletteForTotem(name: string) {
  if (name.includes("月亮")) {
    return { bg: "#eef2ff", main: "#f7f1d8", accent: "#f0bd55" };
  }
  if (name.includes("蘑菇")) {
    return { bg: "#eff9f2", main: "#ef7974", accent: "#fffaf2" };
  }
  if (name.includes("龟")) {
    return { bg: "#ecf7ee", main: "#8fcf9d", accent: "#6eb77d" };
  }
  return { bg: "#fff3df", main: "#f6efe4", accent: "#f0bd55" };
}

export function buildTotemSvg(totem: Totem) {
  const palette = paletteForTotem(totem.totem_name);
  const title = escapeXml(totem.totem_name);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="${title}">
  <rect width="512" height="512" rx="96" fill="${palette.bg}"/>
  <circle cx="108" cy="116" r="10" fill="${palette.accent}" opacity="0.72"/>
  <circle cx="418" cy="310" r="8" fill="${palette.accent}" opacity="0.62"/>
  <path d="M96 356c18-22 40-22 58 0" fill="none" stroke="${palette.accent}" stroke-width="10" stroke-linecap="round" opacity="0.68"/>
  <circle cx="370" cy="150" r="42" fill="${palette.accent}" opacity="0.92"/>
  <path d="M154 285c-42 0-76-31-76-70 0-35 27-64 62-69 16-42 58-72 108-72 63 0 114 47 118 106 37 8 65 39 65 76 0 43-38 78-84 78H154z" fill="${palette.main}" stroke="#20242c" stroke-width="12"/>
  <circle cx="212" cy="237" r="10" fill="#20242c"/>
  <circle cx="304" cy="237" r="10" fill="#20242c"/>
  <path d="M232 270c18 18 48 18 66 0" fill="none" stroke="#20242c" stroke-width="10" stroke-linecap="round"/>
  <path d="M178 382h156" fill="none" stroke="${palette.accent}" stroke-width="12" stroke-linecap="round" opacity="0.72"/>
  <path d="M210 416h92" fill="none" stroke="#20242c" stroke-width="8" stroke-linecap="round" opacity="0.18"/>
</svg>`;
}
