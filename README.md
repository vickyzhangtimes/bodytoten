# BodyTotem 身体图腾所

BodyTotem 是“三人行必有 AI”黑客松 AI Coding 赛道的可运行项目 Demo。

它不是一个单纯的 AI 作图工具，而是一个从用户表达进入商品生产的最小商业闭环：

```text
用户输入小烦恼
-> AI 情绪转译
-> 官方图腾 IP / 自定义图腾
-> AI 图像生成或官方资产
-> 商品预览
-> 模拟订单
-> 工厂生产单
```

## 核心价值

- 不上传照片，不评价身体。
- 把“我不想被评价的地方”转译成“我可以主动讲述的图腾”。
- 让 AI 从内容生成推进到商品生产前端。
- 用统一数据合同串起图腾、图片、商品、订单和生产单。

## 当前版本

V1.17：16 个官方图腾资产完整接入 + 受控 AI 商品化闭环。

- `totemCatalog` 是唯一官方 IP 数据源。
- `/api/generate` 只保留两条路线：
  - preset：命中官方图腾库，使用固定 IP 设定。
  - custom：未命中时调用文本模型生成受控图腾 JSON。
- 16 个官方图腾均已接入 `public/totems/` 第一版 PNG 资产，preset 演示全部为 `ready`。
- `/api/generate-image` 支持 ModelScope `Tongyi-MAI/Z-Image-Turbo`，用于未来 custom 或需要重新生成图像的场景，生成图片保存到 `public/generated/`。
- 商品名由系统生成，不由 AI 随机生成。
- 订单和生产单使用同一个 `image.image_url`，保证设计文件进入履约链路。

## 官方图腾库

当前内置 16 个图腾 IP：

| 输入方向 | 官方图腾 | 生活态度 |
| --- | --- | --- |
| 小肚子 / 爱吃 | 快乐云腹 | 松弛自洽，认真享受生活 |
| 圆脸 | 月亮圆章 | 温柔亲近，自带光感 |
| 社恐 / 害羞 | 隐形蘑菇 | 温柔边界，安静蓄能 |
| 拖延 / 慢热 | 慢慢龟印 | 慢慢抵达，稳定前进 |
| 爱熬夜 | 夜光猫头鹰 | 夜晚发光，也记得照顾自己 |
| 拍照僵硬 | 木偶星人 | 笨拙勇气，允许自己出现 |
| 长痘痘 / 皮肤状态 | 青春星野 | 正在生长，也值得被看见 |
| 说话结巴 / 表达不流畅 | 句子积木 | 慢一点，把想法搭得更稳 |
| 长得矮 / 小个子 | 口袋山丘 | 小小视角，也能站稳世界 |
| 头发少 / 发量焦虑 | 轻羽冠 | 留白也是一种风格 |
| 容易紧张 | 弹簧小鹿 | 敏感但有恢复力 |
| 总是想太多 | 脑内星球 | 丰富思考，内在宇宙 |
| 手小 | 星豆掌印 | 小巧灵活，珍贵触感 |
| 肩窄 / 没气场 | 轻翼肩章 | 轻盈行动，自由穿梭 |
| 容易忘东西 | 记忆贝壳 | 温柔收藏，慢慢想起 |
| 做事犹豫 | 岔路小灯 | 慢慢选择，也能照亮方向 |

## 技术栈

- Next.js App Router
- TypeScript
- React
- 本地 JSON session/order 存储
- OpenAI-compatible 文本模型
- ModelScope Z-Image-Turbo 图像生成

## 本地运行

```powershell
npm install
npm run dev -- --port 3113
```

访问：

```text
http://localhost:3113/
```

## 环境变量

复制 `.env.local.example` 或自行配置：

```text
LLM_API_KEY=
LLM_BASE_URL=
LLM_MODEL=
IMAGE_PROVIDER=modelscope
IMAGE_BASE_URL=
IMAGE_MODEL=Tongyi-MAI/Z-Image-Turbo
IMAGE_API_KEY=
```

不要提交真实 token。

## API

### `POST /api/generate`

输入：

```json
{
  "user_input": "我长痘痘"
}
```

输出重点字段：

```json
{
  "mode": "preset",
  "matched_slug": "spring-star-field",
  "totem": {
    "totem_name": "青春星野",
    "life_attitude": "正在生长，也值得被看见"
  },
  "image": {
    "source": "mock",
    "status": "ready",
    "image_url": "/totems/spring-star-field.png"
  }
}
```

### `POST /api/generate-image`

使用后端 session 里的安全 prompt 生成图片，成功后保存到 `public/generated/`。

### `POST /api/order`

输入 `session_id + product_type`，生成模拟订单和工厂生产单。

## 验证结果

已通过：

```powershell
npm run typecheck
npm run build
```

接口矩阵验证：

- `我长痘痘` -> `青春星野` -> `ready`
- `我说话结巴` -> `句子积木` -> `ready`
- `我长得矮` -> `口袋山丘` -> `ready`
- `我头发少` -> `轻羽冠` -> `ready`
- `我容易紧张` -> `弹簧小鹿` -> `ready`
- `我总是想太多` -> `脑内星球` -> `ready`
- `我手小` -> `星豆掌印` -> `ready`
- `我肩窄没气场` -> `轻翼肩章` -> `ready`
- `我容易忘东西` -> `记忆贝壳` -> `ready`
- `我做事犹豫` -> `岔路小灯` -> `ready`
- `我有点小肚子但很爱吃` -> `快乐云腹` -> `ready`
- `我很社恐` -> `隐形蘑菇` -> `ready`
- `我总是拖延` -> `慢慢龟印` -> `ready`

真实生图验证：

- ModelScope `Tongyi-MAI/Z-Image-Turbo` 链路已验证可生成并保存到 `/generated/*.png`；当前 16 个官方图腾优先使用稳定官方资产，现场演示不依赖实时生图。

## 路演主链路

```text
输入：“我有一点小肚子，但我很爱吃，拍照时总想遮住。”
-> 快乐云腹
-> 图腾收藏卡
-> 快乐云腹徽章 / 手机壳 / 贴纸
-> 模拟下单
-> 工厂生产单
-> 分享卡
```

## 黑客松讲法

我们跑通的不是 AI 画图工具，而是从情绪表达、视觉生成、商品预览、订单确认到工厂生产单的 AI 商品化闭环。

用户端看到的是温柔、有趣的图腾生成体验；商家端看到的是商品 SKU；工厂端拿到的是结构化生产信息。

这意味着 AI 不只是帮人生成图片，而是开始参与消费品从需求定义到生产交付的全过程。
