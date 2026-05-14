import type { ImageAssetStatus, ProductType, Totem } from "./types";
import { buildImagePrompt, NEGATIVE_IMAGE_PROMPT } from "./ai/generateImagePrompt";
import { BANNED_WORDS, containsBannedWords } from "./ai/safety";

export type TotemCatalogItem = {
  slug: string;
  name: string;
  nameEn: string;
  aliases: string[];
  surfaceConcern: string;
  hiddenEmotion: string;
  innerNeed: string;
  lifeAttitude: string;
  visualMetaphor: string;
  oneLine: string;
  safeReframe: string;
  story: string;
  visualKeywords: string[];
  imageUrl: string;
  imageStatus: ImageAssetStatus;
  badgeMockup?: string;
  phonecaseMockup?: string;
  stickerMockup?: string;
  shareCopy: string;
  baseImagePrompt: string;
  negativePrompt: string;
};

export const GENERIC_TOTEM_PLACEHOLDER = "/mock/generic-totem-placeholder.svg";
export const BANNED_TERMS = BANNED_WORDS;

type TotemSeed = Omit<TotemCatalogItem, "baseImagePrompt" | "negativePrompt"> & {
  baseImagePrompt?: string;
  negativePrompt?: string;
};

function defineTotem(seed: TotemSeed): TotemCatalogItem {
  const prompt =
    seed.baseImagePrompt ||
    buildImagePrompt({
      totem_name_en: seed.nameEn,
      life_attitude: seed.lifeAttitude,
      visual_metaphor: seed.visualMetaphor,
      visual_keywords: seed.visualKeywords,
      safe_reframe: seed.safeReframe
    });

  return {
    ...seed,
    baseImagePrompt: prompt,
    negativePrompt: seed.negativePrompt || NEGATIVE_IMAGE_PROMPT
  };
}

export const TOTEM_CATALOG: TotemCatalogItem[] = [
  defineTotem({
    slug: "happy-cloud-belly",
    name: "快乐云腹",
    nameEn: "Happy Cloud Belly",
    aliases: ["小肚子", "肚腩", "爱吃", "拍照想遮", "肚子", "吃多", "吃货"],
    surfaceConcern: "身体松弛感与爱吃的小尴尬",
    hiddenEmotion: "担心身体被评价，也想保留享受生活的自由",
    innerNeed: "希望被温柔接纳，不必因为享受食物而紧张",
    lifeAttitude: "松弛自洽，认真享受生活",
    visualMetaphor: "一朵储存快乐和松弛感的云",
    oneLine: "身体里藏着一朵快乐的云。",
    safeReframe: "这不是需要藏起来的地方，而是一枚储存快乐和松弛感的小图腾。",
    story:
      "快乐云腹代表一种柔软、松弛、会认真享受生活的能量。它不是要你改变自己，而是提醒你用更温柔的方式和自己相处。",
    visualKeywords: ["云朵", "小太阳", "圆润线条", "治愈徽章", "快乐能量"],
    imageUrl: "/totems/happy-cloud-belly.png",
    imageStatus: "ready",
    badgeMockup: "/totems/happy-cloud-belly.png",
    phonecaseMockup: "/totems/happy-cloud-belly.png",
    stickerMockup: "/totems/happy-cloud-belly.png",
    shareCopy: "我不是要藏起自己，我只是在收藏快乐。"
  }),
  defineTotem({
    slug: "moon-face-emblem",
    name: "月亮圆章",
    nameEn: "Moon Face Emblem",
    aliases: ["圆脸", "脸圆", "脸蛋圆", "拍照脸圆"],
    surfaceConcern: "轮廓圆润带来的拍照在意",
    hiddenEmotion: "担心自己在镜头里被比较",
    innerNeed: "希望自己的亲和力和温柔感被看见",
    lifeAttitude: "温柔亲近，自带光感",
    visualMetaphor: "一轮柔和、稳定、容易亲近的小月亮",
    oneLine: "我的轮廓，自带温柔月光。",
    safeReframe: "圆润不是需要被修正的地方，而是一种亲近、柔和、容易被记住的气质。",
    story: "月亮圆章代表温和、亲近和稳定的陪伴感。它像一轮小月亮，提醒你不必变成锋利的形状，也可以拥有自己的光。",
    visualKeywords: ["月亮", "星星", "圆形徽章", "柔光", "亲和力"],
    imageUrl: "/totems/moon-face-emblem.png",
    imageStatus: "ready",
    shareCopy: "我不是不够立体，我只是自带月亮光。"
  }),
  defineTotem({
    slug: "invisible-mushroom",
    name: "隐形蘑菇",
    nameEn: "Invisible Mushroom",
    aliases: ["社恐", "害羞", "不爱社交", "人多紧张", "想躲起来", "社交", "不会社交"],
    surfaceConcern: "在人群里容易紧张或想躲开",
    hiddenEmotion: "担心自己不够会回应别人",
    innerNeed: "希望保有边界，也能被慢慢理解",
    lifeAttitude: "温柔边界，安静蓄能",
    visualMetaphor: "一朵可以为自己撑伞的小蘑菇",
    oneLine: "我的安静，也是一种保护自己的能力。",
    safeReframe: "害羞不是失败，而是一种慢慢打开自己的节奏。",
    story: "隐形蘑菇代表安静、自我保护和柔软的边界感。它不是逃避世界，而是在自己的小伞下慢慢积蓄能量。",
    visualKeywords: ["蘑菇", "小伞", "柔软保护", "安静", "小世界"],
    imageUrl: "/totems/invisible-mushroom.png",
    imageStatus: "ready",
    shareCopy: "我不是不会社交，我只是需要自己的小伞。"
  }),
  defineTotem({
    slug: "slow-turtle-seal",
    name: "慢慢龟印",
    nameEn: "Slow Turtle Seal",
    aliases: ["拖延", "做事慢", "慢热", "ddl", "不想开始", "开始不了"],
    surfaceConcern: "启动慢、节奏慢或容易拖着",
    hiddenEmotion: "担心自己总是落后于别人",
    innerNeed: "希望按自己的节奏开始，也被允许稳定前进",
    lifeAttitude: "慢慢抵达，稳定前进",
    visualMetaphor: "一只带着小印章慢慢往前走的乌龟",
    oneLine: "慢一点，也可以抵达。",
    safeReframe: "拖延背后也许不是懒，而是你需要找到自己的启动节奏。",
    story: "慢慢龟印代表稳定、耐心和属于自己的节奏。它提醒你不必和所有人同速，只要还在往前，就已经很好。",
    visualKeywords: ["乌龟", "时钟", "荷叶", "慢节奏", "稳定"],
    imageUrl: "/totems/slow-turtle-seal.png",
    imageStatus: "ready",
    shareCopy: "我走得慢，但我一直在路上。"
  }),
  defineTotem({
    slug: "night-glow-owl",
    name: "夜光猫头鹰",
    nameEn: "Night Glow Owl",
    aliases: ["熬夜", "晚睡", "夜猫子", "凌晨", "睡不着", "失眠"],
    surfaceConcern: "夜里清醒、晚睡和作息不稳",
    hiddenEmotion: "一边被夜晚吸引，一边担心自己不够自律",
    innerNeed: "希望照顾身体，也珍惜独处时的灵感",
    lifeAttitude: "夜晚发光，也记得照顾自己",
    visualMetaphor: "一只在月光下发亮的小猫头鹰",
    oneLine: "我的灵感，常常在夜里亮起来。",
    safeReframe: "晚睡不只是疲惫，也可能是夜晚给你的创作窗口。",
    story: "夜光猫头鹰代表夜晚的清醒、灵感和独处时的发光感。它提醒你照顾自己，也珍惜那些安静时刻里的创造力。",
    visualKeywords: ["猫头鹰", "月亮", "星星", "灯笼", "夜晚灵感"],
    imageUrl: "/totems/night-glow-owl.png",
    imageStatus: "ready",
    shareCopy: "我的灵感，常常在夜里亮起来。"
  }),
  defineTotem({
    slug: "puppet-star",
    name: "木偶星人",
    nameEn: "Puppet Star",
    aliases: ["拍照僵硬", "镜头尴尬", "表情僵", "不会摆pose", "拍照紧张", "镜头紧张"],
    surfaceConcern: "镜头前不自然或姿态紧绷",
    hiddenEmotion: "担心自己不能自然地出现在别人面前",
    innerNeed: "希望被允许笨拙地练习出现",
    lifeAttitude: "笨拙勇气，允许自己出现",
    visualMetaphor: "一个正在学习登场的小星人",
    oneLine: "我的不自然，也有一点笨拙的可爱。",
    safeReframe: "拍照僵硬不是问题，它只是你还没找到和镜头相处的方式。",
    story: "木偶星人代表可爱的笨拙感和慢慢适应舞台的勇气。它不是要你完美营业，而是允许你用自己的方式出现。",
    visualKeywords: ["木偶", "星星", "舞台", "相机", "笨拙可爱"],
    imageUrl: "/totems/puppet-star.png",
    imageStatus: "ready",
    shareCopy: "我不是不上镜，我只是还在学习和镜头做朋友。"
  }),
  defineTotem({
    slug: "spring-star-field",
    name: "青春星野",
    nameEn: "Spring Star Field",
    aliases: ["痘痘", "长痘", "爆痘", "皮肤状态", "皮肤不好", "痘印", "青春痘", "脸上痘"],
    surfaceConcern: "皮肤变化带来的在意",
    hiddenEmotion: "害怕被看见，也害怕被别人评价状态",
    innerNeed: "希望正在变化的自己也能被温柔接纳",
    lifeAttitude: "正在生长，也值得被看见",
    visualMetaphor: "一片星星像种子落下的春日小原野",
    oneLine: "青春不是无瑕，而是正在生长的星野。",
    safeReframe: "这不是需要被挑出来的地方，而是身体正在经历自己的季节。青春星野把那些让你在意的小点点，转译成正在发光的星群和种子。",
    story:
      "青春星野是一片正在生长的小宇宙。它有星点、有花种、有还没完全展开的光。它提醒你：不必等到完美才值得被看见，正在变化的你，也有自己的生命力。",
    visualKeywords: ["星点", "春野", "种子", "小花", "柔光", "星空花园"],
    imageUrl: "/totems/spring-star-field.png",
    imageStatus: "ready",
    shareCopy: "别人看见的是在意，我选择叫它青春星野。"
  }),
  defineTotem({
    slug: "sentence-blocks",
    name: "句子积木",
    nameEn: "Sentence Blocks",
    aliases: ["结巴", "口吃", "说话结巴", "说话卡", "表达不流畅", "说话紧张", "讲话慢", "说话磕巴"],
    surfaceConcern: "表达时容易停顿或卡住",
    hiddenEmotion: "担心自己的表达被打断、误解或催促",
    innerNeed: "希望自己的话被耐心听见",
    lifeAttitude: "慢一点，把想法搭得更稳",
    visualMetaphor: "一组正在搭成完整句子的温柔积木",
    oneLine: "我的表达有自己的搭建顺序。",
    safeReframe: "表达不一定要快才有力量。句子积木代表认真组织语言、慢慢搭建想法，也代表你希望把话说得更准确、更真诚。",
    story:
      "句子积木会把每一个想法都轻轻放好。它不急着冲出去，而是先确认每句话的位置。它提醒你：慢一点的表达，也可能是更认真、更有逻辑的表达。",
    visualKeywords: ["积木", "声波", "小路", "星星", "温柔搭建", "小房子"],
    imageUrl: "/totems/sentence-blocks.png",
    imageStatus: "ready",
    shareCopy: "别人听见的是停顿，我选择叫它句子积木。"
  }),
  defineTotem({
    slug: "pocket-hill",
    name: "口袋山丘",
    nameEn: "Pocket Hill",
    aliases: ["矮", "个子矮", "小个子", "身高", "不高", "长得矮", "个子小", "身高焦虑"],
    surfaceConcern: "身高比较带来的在意",
    hiddenEmotion: "担心自己的存在感被高度衡量",
    innerNeed: "希望用自己的视角和方式站稳世界",
    lifeAttitude: "小小视角，也能站稳世界",
    visualMetaphor: "一座可以装进口袋却托得住星星的小山丘",
    oneLine: "小小视角，也能看见大世界。",
    safeReframe: "存在感不靠高度决定。口袋山丘代表稳定、灵活和独特视角，也代表你用自己的方式站稳世界。",
    story:
      "口袋山丘是一座小小但坚定的山。它不需要很高，也能托住云、风和星星。它提醒你：真正的存在感，不是来自被比较，而是来自你如何站稳自己。",
    visualKeywords: ["小山丘", "口袋", "小旗帜", "云朵", "星星", "小路"],
    imageUrl: "/totems/pocket-hill.png",
    imageStatus: "ready",
    shareCopy: "别人比较的是高度，我选择叫它口袋山丘。"
  }),
  defineTotem({
    slug: "feather-crown",
    name: "轻羽冠",
    nameEn: "Feather Crown",
    aliases: ["头发少", "发量少", "发量焦虑", "脱发", "头发稀疏", "头发不多", "发量小"],
    surfaceConcern: "发量变化带来的外在在意",
    hiddenEmotion: "担心自己的状态被别人放大解读",
    innerNeed: "希望把留白转化为自己的风格和边界",
    lifeAttitude: "留白也是一种风格",
    visualMetaphor: "由微风和羽毛组成的一枚轻盈小冠冕",
    oneLine: "轻一点，也可以很有风格。",
    safeReframe: "外在状态不决定你的价值。轻羽冠代表轻盈、清爽和自带边界的气质。它不是为了遮掩什么，而是把留白变成一种风格。",
    story: "轻羽冠是一枚由微风和羽毛组成的小冠冕。它不靠厚重取胜，而是靠清爽、轻盈和自己的轮廓感被记住。",
    visualKeywords: ["羽毛", "微风", "小皇冠", "星点", "柔光", "留白"],
    imageUrl: "/totems/feather-crown.png",
    imageStatus: "ready",
    shareCopy: "别人注意到的是留白，我选择叫它轻羽冠。"
  }),
  defineTotem({
    slug: "spring-deer",
    name: "弹簧小鹿",
    nameEn: "Spring Deer",
    aliases: ["容易紧张", "紧张", "手抖", "发抖", "心慌", "上台紧张"],
    surfaceConcern: "紧张时身体和情绪容易被拉紧",
    hiddenEmotion: "担心自己一紧张就失控或表现不好",
    innerNeed: "希望承认敏感，同时相信自己可以恢复",
    lifeAttitude: "敏感但有恢复力",
    visualMetaphor: "一只带着弹簧感、会轻轻弹回来的小鹿",
    oneLine: "我会紧张，也会弹回来。",
    safeReframe: "紧张不是失败信号，而是身体在认真准备。弹簧小鹿代表敏感、反应快，也代表你可以慢慢回到自己的节奏。",
    story: "弹簧小鹿总会先听见风声，也会先跳起来。它不是胆小，而是对世界足够敏感。等风过去，它会轻轻落地，再一次站稳。",
    visualKeywords: ["小鹿", "弹簧", "草地", "柔光", "恢复力", "星星"],
    imageUrl: "/totems/spring-deer.png",
    imageStatus: "ready",
    shareCopy: "我会紧张，也会弹回来。"
  }),
  defineTotem({
    slug: "mind-planet",
    name: "脑内星球",
    nameEn: "Mind Planet",
    aliases: ["想太多", "内耗", "脑子停不下来", "焦虑", "胡思乱想", "过度思考"],
    surfaceConcern: "想法太多，脑内很难安静",
    hiddenEmotion: "担心自己被想法拉着走，也担心不够确定",
    innerNeed: "希望复杂的思考被理解，而不是被催促关闭",
    lifeAttitude: "丰富思考，内在宇宙",
    visualMetaphor: "一颗装满想法轨道和小灯点的星球",
    oneLine: "想法很多，也是我的宇宙在发光。",
    safeReframe: "想得多不只是消耗，也说明你有丰富的感受和联想。脑内星球把这些轨道收进一个有秩序的小宇宙。",
    story: "脑内星球有很多环绕轨道，想法像小卫星一样转来转去。它提醒你：内在世界很大，也可以慢慢找到属于自己的运行节奏。",
    visualKeywords: ["星球", "轨道", "小灯", "卫星", "宇宙", "思考光点"],
    imageUrl: "/totems/mind-planet.png",
    imageStatus: "ready",
    shareCopy: "想法很多，也是我的宇宙在发光。"
  }),
  defineTotem({
    slug: "star-bean-palm",
    name: "星豆掌印",
    nameEn: "Star Bean Palm",
    aliases: ["手小", "手很小", "小手", "掌心小", "手掌小"],
    surfaceConcern: "手小带来的可见差异",
    hiddenEmotion: "担心自己被说不够有力量",
    innerNeed: "希望小巧也能被理解为灵活和珍贵",
    lifeAttitude: "小巧灵活，珍贵触感",
    visualMetaphor: "星星和豆子组成的一枚小掌印",
    oneLine: "小小掌心，也能握住星光。",
    safeReframe: "大小不是力量的唯一尺度。星豆掌印代表灵活、细腻和珍贵的触感，也代表你用自己的方式握住世界。",
    story: "星豆掌印像一枚小小的宇宙手印，里面藏着星星和豆子。它提醒你：小巧不是少一分，而是多了一点灵活和珍贵。",
    visualKeywords: ["掌印", "星豆", "柔光", "小星星", "圆润徽章"],
    imageUrl: "/totems/star-bean-palm.png",
    imageStatus: "ready",
    shareCopy: "小小掌心，也能握住星光。"
  }),
  defineTotem({
    slug: "light-wing-shoulder",
    name: "轻翼肩章",
    nameEn: "Light Wing Shoulder Emblem",
    aliases: ["肩窄", "没气场", "肩膀窄", "气场弱", "撑不起衣服"],
    surfaceConcern: "肩部线条或气场带来的在意",
    hiddenEmotion: "担心自己看起来不够有存在感",
    innerNeed: "希望轻盈也能成为一种有力量的出现方式",
    lifeAttitude: "轻盈行动，自由穿梭",
    visualMetaphor: "一枚轻羽翅膀形状的小肩章",
    oneLine: "轻一点，也能飞得很远。",
    safeReframe: "气场不只来自宽阔，也来自行动的方向。轻翼肩章代表轻盈、自由和移动中的力量。",
    story: "轻翼肩章是一对不沉重的小翅膀。它不需要占满空间，却能带你穿过风。它提醒你：轻盈也可以很有方向。",
    visualKeywords: ["羽翼", "肩章", "风", "星点", "轻盈", "徽章"],
    imageUrl: "/totems/light-wing-shoulder.png",
    imageStatus: "ready",
    shareCopy: "轻一点，也能飞得很远。"
  }),
  defineTotem({
    slug: "memory-shell",
    name: "记忆贝壳",
    nameEn: "Memory Shell",
    aliases: ["忘东西", "健忘", "丢三落四", "记不住", "总忘", "容易忘"],
    surfaceConcern: "容易忘记或丢三落四",
    hiddenEmotion: "担心自己不够可靠，也担心遗漏重要的事",
    innerNeed: "希望被允许慢慢想起，也建立温柔的提醒方式",
    lifeAttitude: "温柔收藏，慢慢想起",
    visualMetaphor: "一只会把星光和小纸条收藏起来的贝壳",
    oneLine: "记忆有潮汐，重要的会回到岸边。",
    safeReframe: "遗忘不等于不在乎。记忆贝壳代表温柔收藏和慢慢想起，也提醒你为重要的事留一个安全的岸边。",
    story: "记忆贝壳把小星星、小纸条和海风都收在壳里。它知道记忆有潮汐，有些事会晚一点回来，但重要的总能被重新捡起。",
    visualKeywords: ["贝壳", "潮汐", "星光", "小纸条", "海风", "收藏"],
    imageUrl: "/totems/memory-shell.png",
    imageStatus: "ready",
    shareCopy: "记忆有潮汐，重要的会回到岸边。"
  }),
  defineTotem({
    slug: "fork-road-lamp",
    name: "岔路小灯",
    nameEn: "Fork Road Lamp",
    aliases: ["犹豫", "选择困难", "纠结", "拿不定主意", "做决定慢"],
    surfaceConcern: "做选择时容易犹豫",
    hiddenEmotion: "担心选错，也担心辜负某个可能性",
    innerNeed: "希望认真比较之后，也能被允许慢慢决定",
    lifeAttitude: "慢慢选择，也能照亮方向",
    visualMetaphor: "岔路口的一盏小灯，照亮每条路的起点",
    oneLine: "犹豫不是停下，是在认真找路。",
    safeReframe: "犹豫不是没有方向，而是在认真看见不同的可能。岔路小灯代表谨慎选择，也代表你愿意为自己的路负责。",
    story: "岔路小灯站在分岔口，不替你催促决定，只把每条路照亮一点。它提醒你：慢慢选择，也是在认真和未来打招呼。",
    visualKeywords: ["岔路", "小灯", "路牌", "星光", "温暖光圈", "方向"],
    imageUrl: "/totems/fork-road-lamp.png",
    imageStatus: "ready",
    shareCopy: "犹豫不是停下，是在认真找路。"
  })
];

export function containsUnsafeTerm(text: string) {
  return containsBannedWords(text);
}

export function findPresetTotem(userInput: string) {
  const normalized = userInput.toLowerCase();
  return (
    TOTEM_CATALOG.find((item) => item.aliases.some((alias) => normalized.includes(alias.toLowerCase()))) ?? null
  );
}

export function catalogItemToTotem(item: TotemCatalogItem, personalizedSentence?: string): Totem {
  const sentence =
    personalizedSentence && !containsUnsafeTerm(personalizedSentence)
      ? personalizedSentence
      : item.safeReframe;

  return {
    slug: item.slug,
    totem_name: item.name,
    totem_name_en: item.nameEn,
    surface_concern: item.surfaceConcern,
    hidden_emotion: item.hiddenEmotion,
    inner_need: item.innerNeed,
    life_attitude: item.lifeAttitude,
    visual_metaphor: item.visualMetaphor,
    safe_reframe: item.safeReframe,
    one_line: item.oneLine,
    personalized_sentence: sentence,
    positive_interpretation: sentence,
    totem_story: item.story,
    visual_keywords: item.visualKeywords,
    visual_elements: item.visualKeywords,
    image_url: item.imageUrl,
    image_prompt: item.baseImagePrompt,
    negative_prompt: item.negativePrompt,
    recommended_products: ["badge", "phone_case", "sticker"] as ProductType[],
    safety_note: "不评价身体，不制造焦虑，只把用户主动表达转译成温柔、积极、可商品化的个人符号。",
    share_copy: item.shareCopy,
    share_caption: item.shareCopy
  };
}

export function fallbackTotem() {
  return TOTEM_CATALOG[0];
}
