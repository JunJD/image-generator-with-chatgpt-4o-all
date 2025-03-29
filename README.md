<p align="center">
  一个开源的AI图像生成应用，使用Next.js、AI SDK和OpenAI API构建。
</p>

<p align="center">
  <a href="#功能特点"><strong>功能特点</strong></a> ·
  <a href="#模型与API"><strong>模型与API</strong></a> ·
  <a href="#部署指南"><strong>部署指南</strong></a> ·
  <a href="#本地运行"><strong>本地运行</strong></a> ·
  <a href="#开发路线图"><strong>开发路线图</strong></a>
</p>
<br/>

## 功能特点

- 使用[Vercel AI SDK](https://sdk.vercel.ai/docs)的[`generateImage`](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-image)进行图像生成
- 现代化响应式UI，由[Aceternity UI](https://ui.aceternity.com/components)和[Tailwind CSS](https://tailwindcss.com)提供支持
- 采用最新的[Next.js](https://nextjs.org) App Router构建

## 模型与API

此应用使用OpenAI的图像生成API。为了降低使用成本，我们采用了第三方API路由转发服务：

- **gptgod.online**：主要API转发服务
- **openai.linktre.cc**：备用API转发服务

这些服务允许以更低的成本访问OpenAI的强大模型，特别是用于图像生成的DALL-E模型和多模态的chatgpt-4o模型(懂的都懂)。

## 部署指南

### 环境变量设置

部署前，您需要设置以下环境变量：

```
OPENAI_API_KEY=您的OpenAI API密钥或路由转发服务密钥
OPENAI_BASE_URL=API基础URL（如果使用路由转发服务）
```

### Vercel部署

1. Fork [此仓库](https://github.com/JunJD/image-generator-with-chatgpt-4o-all) 到您的GitHub账户
2. 在Vercel上创建新项目，选择您fork的仓库
3. 在Vercel项目设置中添加上述环境变量
4. 部署项目

## 本地运行

1. 克隆仓库并安装依赖：
   ```bash
   git clone https://github.com/JunJD/image-generator-with-chatgpt-4o-all.git
   cd image-generator-with-chatgpt-4o-all
   npm install
   # 或
   pnpm install
   ```

2. 复制`.env.example`文件为`.env.local`，并填入您的API密钥：
   ```bash
   cp .env.example .env.local
   ```

3. 运行开发服务器：
   ```bash
   npm run dev
   # 或
   pnpm dev
   ```

4. 打开[http://localhost:3000](http://localhost:3000)查看您的应用。

## 开发路线图

我们计划实现以下功能：

1. **移动端优先**
   - 移动端优先，响应式布局设计

2. **ChatGPT-4o模型集成**
   - 利用最新的ChatGPT-4o模型来生成高质量图像

3. **注册码机制**
   - 每次进入应用时加载本地存储的注册码并验证
   - 使用Aceternity UI的AnimatedModal组件展示注册界面

4. **自定义提示风格**
   - 提供多种艺术风格选项：宫崎骏、皮克斯、乐高、动漫等
   - 使用Aceternity UI组件优化选择界面

5. **图片上传功能**
   - 支持用户上传参考图片
   - 利用OpenAI多模态接口进行图像理解和生成
   ```javascript
   import OpenAI from "openai";

   const openai = new OpenAI();
   const response = await openai.responses.create({
       model: "gpt-4o-mini",
       input: [{
           role: "user",
           content: [
               { type: "input_text", text: "描述这张图片并创建类似风格的新图像" },
               {
                   type: "input_image",
                   image_url: "您的图片URL",
               },
           ],
       }],
   });
   ```

## 作者

这个仓库由[Vercel](https://vercel.com)团队和社区贡献者维护。特别感谢：

- Walter Korman ([@shaper](https://x.com/shaper)) - [Vercel](https://vercel.com)
- Nico Albanese ([@nicoalbanese10](https://x.com/nicoalbanese10)) - [Vercel](https://vercel.com)

欢迎贡献！请随时提出问题或提交拉取请求以增强功能或修复错误。
