# 智能定价 Agent 前端 Demo

面向 AI 创业者的智能定价服务，集成于 **Subotiz** 平台（类似 Lemon Squeeze、Paddle 的虚拟商品订阅支付 SaaS）。

## 功能模块与流程

- **市场洞察**（独立 Tab）：搜寻竞品、了解竞品定价、监控竞品价格变化。
- **价格建议**（主流程）：
  1. **获取定价方案**：冷启动 / 存量优化 / 综合定价（或商户导入配置）。
  2. **推荐结果**：展示结构化方案后，附带 **定价逻辑解释**（为何建议此区间/结构）与可展开的 **定价知识库**。
  3. **确认应用**：用户点击「应用该方案并配置定价」后，出现 **快速配置**：一键创建定价（product/price）、价格表配置。

定价逻辑与快速配置均为价格建议流程中的环节，非独立一级模块。

## 竞品参考

- [Atlas](https://www.runonatlas.com) — Revenue Intelligence for AI Companies

## 本地运行

```bash
cd pricing-agent-demo
# 用任意静态服务器打开，或直接打开 index.html
npx serve .
# 或
python3 -m http.server 8080
```

浏览器访问 `http://localhost:8080`（或 serve 提示的地址）。

## 文件说明

- `index.html` — 主页面与四大模块 UI
- `styles.css` — 样式（深色主题、响应式）
- `app.js` — 顶部 Tab 切换逻辑
