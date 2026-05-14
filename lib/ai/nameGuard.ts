import { containsBannedNameWords } from "./safety";

const HARSH_NAME_CHARS = [
  "钩", "刺", "疤", "裂", "丧", "病", "痛", "丑", "肥",
  "怪", "鬼", "怂", "废", "掌", "手", "脚", "腿", "脸",
  "肚", "腰", "腹", "矮", "秃", "痘"
];

// 大幅扩充：允许更多有美感、有意象、有品牌感的字结尾
const SOFT_NAME_ENDINGS = [
  "印", "章", "星", "灯", "岛", "芽", "云", "环", "盏", "符", "舟", "花", "光",
  "球", "石", "鹿", "羽", "贝", "珠", "壳", "蛋", "果", "叶", "根", "枝",
  "月", "日", "风", "雨", "雪", "雾", "晨", "夕", "夜", "晴",
  "园", "林", "山", "海", "洋", "湖", "池", "溪",
  "猫", "鸟", "鱼", "兔", "熊", "鲸", "虎", "龟",
  "记", "诗", "歌", "曲", "画", "卷",
  "塔", "亭", "台", "堡", "阁",
  "号", "牌", "徽", "纹", "格"
];

const AWKWARD_NAME_MAP: Record<string, string> = {
  情心章: "心光印",
  钩金光: "心光印",
  掌镇星: "定心灯",
  星步灯: "岔路小灯"
};

export function fallbackTotemNameFromInput(userInput: string) {
  const text = userInput.toLowerCase();
  if (text.includes("想太多") || text.includes("焦虑") || text.includes("内耗")) return "脑内星球";
  if (text.includes("忘") || text.includes("丢三落四") || text.includes("记不住")) return "记忆贝壳";
  if (text.includes("紧张") || text.includes("手抖") || text.includes("发抖")) return "弹簧小鹿";
  if (text.includes("个子") || text.includes("身高") || text.includes("小个子") || text.includes("不高") || text.includes("矮")) return "口袋山丘";
  if (text.includes("头发") || text.includes("发量") || text.includes("掉发") || text.includes("秃")) return "轻羽冠";
  if (text.includes("痘") || text.includes("痘痘") || text.includes("爆痘") || text.includes("皮肤")) return "青春星野";
  if (text.includes("结巴") || text.includes("口吃") || text.includes("说话卡") || text.includes("表达")) return "句子积木";
  if (text.includes("手小") || text.includes("小手") || text.includes("掌心")) return "星豆掌印";
  if (text.includes("肩") || text.includes("气场")) return "轻翼肩章";
  if (text.includes("犹豫") || text.includes("纠结") || text.includes("选择困难")) return "岔路小灯";
  if (text.includes("慢热") || text.includes("不熟") || text.includes("熟了")) return "隐形蘑菇";
  if (text.includes("敏感") || text.includes("玻璃心") || text.includes("容易难过")) return "心光印";
  if (text.includes("发光") || text.includes("存在感") || text.includes("被看见")) return "微光小章";
  if (text.includes("爱吃") || text.includes("吃货") || text.includes("胃口") || text.includes("嘴馋")) return "快乐云腹";
  if (text.includes("睡") || text.includes("懒") || text.includes("躺平")) return "暖阳懒熊";
  if (text.includes("哭") || text.includes("泪") || text.includes("情绪化")) return "晴雨珠";
  return "柔光小印";
}

export function normalizeBrandTotemName(value: unknown, userInput: string) {
  const fallback = fallbackTotemNameFromInput(userInput);
  const name = String(value || "").trim();

  if (AWKWARD_NAME_MAP[name]) return AWKWARD_NAME_MAP[name];
  if (!name) return fallback;
  if (containsBannedNameWords(name)) return fallback;
  // 允许 2-6 个汉字（原来 3-5，扩到 2-6 给更多空间）
  if (!/^[\u4e00-\u9fa5]{2,6}$/.test(name)) return fallback;
  if (HARSH_NAME_CHARS.some((char) => name.includes(char))) return fallback;
  // 结尾校验变成「警告但不直接 fallback」——只过滤明显工业/硬感结尾
  const HARD_ENDINGS = ["器", "机", "炉", "锅", "刀", "枪", "炸", "爆", "毒"];
  if (HARD_ENDINGS.some((e) => name.endsWith(e))) return fallback;

  return name;
}
