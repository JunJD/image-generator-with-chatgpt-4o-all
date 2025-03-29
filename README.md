<a href="https://ai-sdk-image-generator.vercel.app">
  <img alt="Next.js 14 和 App Router AI SDK 图像生成器" src="https://ai-sdk-image-generator.vercel.app/opengraph-image.png">
  <h1 align="center">AI SDK 图像生成器</h1>
</a>

<p align="center">
  一个开源的AI图像生成应用模板，使用Next.js、Vercel的AI SDK和各种AI提供商（Replicate、Fireworks、Google Vertex AI、OpenAI）构建。
</p>

<p align="center">
  <a href="#功能特点"><strong>功能特点</strong></a> ·
  <a href="#模型提供商"><strong>模型提供商</strong></a> ·
  <a href="#部署你自己的版本"><strong>部署你自己的版本</strong></a> ·
  <a href="#本地运行"><strong>本地运行</strong></a> ·
  <a href="#开发路线图"><strong>开发路线图</strong></a> ·
  <a href="#作者"><strong>作者</strong></a>
</p>
<br/>

## 功能特点

- 支持使用来自[Vercel AI SDK](https://sdk.vercel.ai/docs)的[`generateImage`](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-image)进行图像生成，只需几行代码即可互换使用多个AI提供商。
- 单一输入同时在多个提供商上生成图像。
- 使用[shadcn/ui](https://ui.shadcn.com/)组件构建现代响应式UI，由[Tailwind CSS](https://tailwindcss.com)提供支持。
- 采用最新的[Next.js](https://nextjs.org) App Router（版本15）构建。

## 模型提供商

此模板默认包含以下提供商：

- [Replicate](https://sdk.vercel.ai/providers/ai-sdk-providers/replicate)
- [Google Vertex AI](https://sdk.vercel.ai/providers/ai-sdk-providers/google-vertex)
- [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)
- [Fireworks](https://sdk.vercel.ai/providers/ai-sdk-providers/fireworks)

您可以通过更新代码库中的配置轻松添加或删除提供商（及其关联模型）。

## 部署你自己的版本

您可以通过点击下面的按钮将AI SDK图像生成器的自己版本部署到Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-image-generator&env=FIREWORKS_API_KEY,GOOGLE_CLIENT_EMAIL,GOOGLE_PRIVATE_KEY_ID,GOOGLE_VERTEX_LOCATION,GOOGLE_VERTEX_PROJECT,OPENAI_API_KEY,REPLICATE_API_TOKEN&envDescription=AI%20Provider%20API%20keys%20required%20for%20this%20demo.&envLink=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-image-generator&demo-title=AI%20SDK%20Image%20Generator&demo-description=%20%20An%20open-source%20AI%20image%20generation%20app%20template%20built%20with%20Next.js%2C%20the%20AI%20SDK%20by%20Vercel%2C%20and%20various%20AI%20providers%20(Replicate%2C%20Fireworks%2C%20Google%20Vertex%20AI%2C%20OpenAI).&demo-url=https%3A%2F%2Fai-sdk-image-generator.vercel.app%2F&demo-image=https%3A%2F%2Fai-sdk-image-generator.vercel.app%2Fopengraph-image.png)

## 本地运行

1. 克隆仓库并安装依赖：
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

2. 创建一个`.env.local`文件（或在Vercel仪表板中设置环境变量）来存储您计划使用的提供商所需的API密钥。有一个`.env.example`文件可以作为参考。

   ```
   # 标准API密钥
   OPENAI_API_KEY=...
   REPLICATE_API_TOKEN=...
   FIREWORKS_API_KEY=...

   # Google Vertex AI设置
   GOOGLE_CLIENT_EMAIL=...        # 来自您的服务账户JSON文件
   GOOGLE_PRIVATE_KEY=...         # 来自您的服务账户JSON文件
   GOOGLE_VERTEX_PROJECT=...      # 您的Google Cloud项目ID
   GOOGLE_VERTEX_LOCATION=...     # 例如 "us-central1"
   ```

   对于Google Vertex AI设置：
   - 从Google Cloud控制台获取您的服务账户凭据
   - `GOOGLE_CLIENT_EMAIL`和`GOOGLE_PRIVATE_KEY`的值可以在您的服务账户JSON文件中找到
   - 将`GOOGLE_VERTEX_LOCATION`设置为您首选的区域（例如，"us-central1"）
   - 将`GOOGLE_VERTEX_PROJECT`设置为您的Google Cloud项目ID

   有关Google Vertex AI配置的更多详情，请参阅[AI SDK文档](https://sdk.vercel.ai/providers/ai-sdk-providers/google-vertex#edge-runtime)。

3. 运行开发服务器：
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

4. 打开[http://localhost:3000](http://localhost:3000)查看您的新AI图像生成器应用程序。

## 开发路线图

我们计划实现以下功能：

0. **mobile first**
   - 移动端优先，响应式布局

1. **ChatGPT-4o模型集成**
   - 利用最新的ChatGPT-4o模型来生成高质量图像

2. **注册码机制**
   - 每次进入应用时加载本地存储的注册码并验证是否已使用
   - 未使用注册码时，弹出一个Aceternity UI的AnimatedModal供用户填写注册码
   - 使用AnimatedTooltip组件提供问号提示说明

3. **验证流程**
   - 如果注册码尚未使用，用户可直接进入主页面

4. **自定义Suggestions功能**
   - 允许用户自行选择提示风格，不再随机选择
   - 提供多种风格选项：无风格、宫崎骏、皮克斯、乐高、动漫、新海诚、迪士尼、油画、自定义
   - 默认展示宫崎骏风格
   - 右侧添加使用Aceternity UI的"更多"按钮

5. **支持上传图片**
   - 支持用户上传图片，借助openai 多模态的接口
   - 上传组件可以用 file-upload

6. **提供商支持**
   - 初期仅支持OpenAI的图像生成功能
   ```javascriptimport OpenAI from "openai";

      const openai = new OpenAI();

      const response = await openai.responses.create({
          model: "gpt-4o-mini",
          input: [{
              role: "user",
              content: [
                  { type: "input_text", text: "what's in this image?" },
                  {
                      type: "input_image",
                      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                  },
              ],
          }],
      });

      console.log(response.output_text);
  ```
   - 暂时注释其他三个提供商（后续再看要不要再添加）

## 作者

这个仓库由[Vercel](https://vercel.com)团队和社区贡献者维护。特别感谢：

- Walter Korman ([@shaper](https://x.com/shaper)) - [Vercel](https://vercel.com)
- Nico Albanese ([@nicoalbanese10](https://x.com/nicoalbanese10)) - [Vercel](https://vercel.com)

欢迎贡献！请随时提出问题或提交拉取请求以增强功能或修复错误。
