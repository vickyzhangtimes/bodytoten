// 60 curated gradients from coolhue — each mapped to a mood tag
// https://github.com/webkul/coolhue

export type CoolhueGradient = {
  id: number;
  start: string;
  end: string;
  angle?: number;
  tags: string[];
};

export const GRADIENTS: CoolhueGradient[] = [
  { id: 1,  start: "#FDEB71", end: "#F8D800", tags: ["yellow", "bright", "sunny", "happy"] },
  { id: 2,  start: "#ABDCFF", end: "#0396FF", tags: ["blue", "sky", "calm", "clear"] },
  { id: 3,  start: "#FEB692", end: "#EA5455", tags: ["orange", "red", "warm", "energy"] },
  { id: 4,  start: "#CE9FFC", end: "#7367F0", tags: ["purple", "violet", "dream", "magic"] },
  { id: 5,  start: "#90F7EC", end: "#32CCBC", tags: ["teal", "mint", "fresh", "ocean"] },
  { id: 6,  start: "#FFF6B7", end: "#F6416C", tags: ["yellow", "pink", "sweet", "candy"] },
  { id: 7,  start: "#81FBB8", end: "#28C76F", tags: ["green", "nature", "life", "growth"] },
  { id: 8,  start: "#E2B0FF", end: "#9F44D3", tags: ["purple", "lavender", "gentle", "soft"] },
  { id: 9,  start: "#F97794", end: "#623AA2", tags: ["pink", "purple", "romantic", "night"] },
  { id: 10, start: "#FCCF31", end: "#F55555", tags: ["yellow", "red", "fire", "bold"] },
  { id: 11, start: "#F761A1", end: "#8C1BAB", tags: ["pink", "magenta", "vivid", "passion"] },
  { id: 12, start: "#43CBFF", end: "#9708CC", tags: ["blue", "purple", "electric", "neon"] },
  { id: 13, start: "#5EFCE8", end: "#736EFE", tags: ["teal", "purple", "cool", "cyber"] },
  { id: 14, start: "#FAD7A1", end: "#E96D71", tags: ["peach", "warm", "soft", "cozy"] },
  { id: 15, start: "#FFD26F", end: "#3677FF", tags: ["gold", "blue", "contrast", "vibrant"] },
  { id: 16, start: "#A0FE65", end: "#FA016D", tags: ["green", "pink", "pop", "wild"] },
  { id: 17, start: "#FFDB01", end: "#0E197D", tags: ["yellow", "navy", "bold", "strong"] },
  { id: 18, start: "#FEC163", end: "#DE4313", tags: ["amber", "orange", "sunset", "warm"] },
  { id: 19, start: "#92FFC0", end: "#002661", tags: ["mint", "navy", "deep", "ocean"] },
  { id: 20, start: "#EEAD92", end: "#6018DC", tags: ["peach", "purple", "dreamy", "magic"] },
  { id: 21, start: "#F6CEEC", end: "#D939CD", tags: ["pink", "rose", "bloom", "flower"] },
  { id: 22, start: "#52E5E7", end: "#130CB7", tags: ["cyan", "blue", "deep", "night"] },
  { id: 23, start: "#F1CA74", end: "#A64DB6", tags: ["gold", "purple", "royal", "rich"] },
  { id: 24, start: "#E8D07A", end: "#5312D6", tags: ["yellow", "purple", "galaxy", "star"] },
  { id: 25, start: "#EECE13", end: "#B210FF", tags: ["yellow", "purple", "electric", "totem"] },
  { id: 26, start: "#79F1A4", end: "#0E5CAD", tags: ["green", "blue", "nature", "calm"] },
  { id: 27, start: "#FDD819", end: "#E80505", tags: ["yellow", "red", "alert", "bold"] },
  { id: 28, start: "#FFF3B0", end: "#CA26FF", tags: ["cream", "purple", "soft", "magic"] },
  { id: 29, start: "#FFF5C3", end: "#9452A5", tags: ["cream", "purple", "gentle", "light"] },
  { id: 30, start: "#F05F57", end: "#360940", tags: ["red", "dark", "deep", "dramatic"] },
  { id: 31, start: "#2AFADF", end: "#4C83FF", tags: ["cyan", "blue", "ocean", "fresh"] },
  { id: 32, start: "#FFF886", end: "#F072B6", tags: ["yellow", "pink", "sweet", "bubbly"] },
  { id: 33, start: "#97ABFF", end: "#123597", tags: ["lavender", "navy", "calm", "trust"] },
  { id: 34, start: "#F5CBFF", end: "#C346C2", tags: ["pink", "purple", "blossom", "soft"] },
  { id: 35, start: "#FFF720", end: "#3CD500", tags: ["yellow", "green", "bright", "fresh"] },
  { id: 36, start: "#FF6FD8", end: "#3813C2", tags: ["pink", "blue", "vivid", "pop"] },
  { id: 37, start: "#EE9AE5", end: "#5961F9", tags: ["pink", "indigo", "dreamy", "cloud"] },
  { id: 38, start: "#FFD3A5", end: "#FD6585", tags: ["peach", "coral", "warm", "cozy"] },
  { id: 39, start: "#C2FFD8", end: "#465EFB", tags: ["mint", "blue", "cool", "light"] },
  { id: 40, start: "#FD6585", end: "#0D25B9", tags: ["coral", "navy", "bold", "contrast"] },
  { id: 41, start: "#FD6E6A", end: "#FFC600", tags: ["red", "gold", "fire", "energy"] },
  { id: 42, start: "#65FDF0", end: "#1D6FA3", tags: ["aqua", "blue", "sea", "calm"] },
  { id: 43, start: "#6B73FF", end: "#000DFF", tags: ["blue", "indigo", "deep", "night"] },
  { id: 44, start: "#FF7AF5", end: "#513162", tags: ["pink", "plum", "magic", "fantasy"] },
  { id: 45, start: "#F0FF00", end: "#58CFFB", tags: ["lime", "cyan", "fresh", "neon"] },
  { id: 46, start: "#FFE985", end: "#FA742B", tags: ["yellow", "orange", "sunset", "warm"] },
  { id: 47, start: "#FFA6B7", end: "#1E2AD2", tags: ["pink", "blue", "contrast", "sweet"] },
  { id: 48, start: "#FFAA85", end: "#B3315F", tags: ["peach", "rose", "bloom", "warm"] },
  { id: 49, start: "#72EDF2", end: "#5151E5", tags: ["aqua", "purple", "cool", "cyber"] },
  { id: 50, start: "#FF9D6C", end: "#BB4E75", tags: ["orange", "pink", "sunset", "warm"] },
  { id: 51, start: "#F6D242", end: "#FF52E5", tags: ["gold", "magenta", "vivid", "pop"] },
  { id: 52, start: "#69FF97", end: "#00E4FF", tags: ["green", "cyan", "bright", "fresh"] },
  { id: 53, start: "#3B2667", end: "#BC78EC", tags: ["dark", "purple", "mystic", "deep"] },
  { id: 54, start: "#70F570", end: "#49C628", tags: ["green", "nature", "fresh", "growth"] },
  { id: 55, start: "#3C8CE7", end: "#00EAFF", tags: ["blue", "cyan", "ocean", "sky"] },
  { id: 56, start: "#FAB2FF", end: "#1904E5", tags: ["pink", "purple", "deep", "electric"] },
  { id: 57, start: "#81FFEF", end: "#F067B4", tags: ["mint", "pink", "sweet", "soft"] },
  { id: 58, start: "#FFA8A8", end: "#FCFF00", tags: ["pink", "yellow", "playful", "fun"] },
  { id: 59, start: "#FFCF71", end: "#2376DD", tags: ["amber", "blue", "contrast", "day"] },
  { id: 60, start: "#FF96F9", end: "#C32BAC", tags: ["pink", "magenta", "vivid", "bold"] },
];

// 根据图腾 slug/name 稳定选出一个渐变（hash，不随机）
export function pickGradient(seed: string): CoolhueGradient {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  const idx = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[idx];
}

export function gradientToCss(g: CoolhueGradient, angle = 135): string {
  return `linear-gradient(${angle}deg, ${g.start} 0%, ${g.end} 100%)`;
}

// 从渐变生成配套的暗色背景版本（用于网站背景）
export function gradientToTheme(g: CoolhueGradient) {
  return {
    accent: g.start,
    accentEnd: g.end,
    // 暗化版本用于背景
    bgGrad: `linear-gradient(135deg, ${g.start}18 0%, ${g.end}18 100%)`,
    // 亮版用于按钮/高亮
    btnGrad: `linear-gradient(135deg, ${g.start} 0%, ${g.end} 100%)`,
    // border active
    borderActive: `${g.start}88`,
  };
}
