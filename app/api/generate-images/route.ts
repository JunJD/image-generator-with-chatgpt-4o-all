import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GenerateImageRequest } from "@/lib/api-types";

/**
 * 设置比运行时最大执行时间略小的超时时间，以便优雅地终止请求
 */
const TIMEOUT_MILLIS = 60 * 5 * 1000;

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});


const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMillis: number
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeoutMillis)
    ),
  ]);
};

export async function POST(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  const { prompt, provider, modelId, uploadedImage } =
    (await req.json()) as GenerateImageRequest;

  try {
    if (!prompt || provider !== "openai") {
      const error = "无效请求参数，目前仅支持OpenAI提供商";
      console.error(`${error} [requestId=${requestId}]`);
      return NextResponse.json({ error }, { status: 400 });
    }

    const startstamp = performance.now();

    // 准备提示词 - 这里我们直接使用传入的prompt，现在它已经包含了风格信息
    const enhancedPrompt = uploadedImage 
      ? `${prompt} The input image is the reference. Please preserve the main subjects, composition and content from the original image, but transform its visual style as specified.` 
      : prompt;
    
    // 准备消息内容数组
    let contentItems: any[] = [
      {
        type: "text",
        text: enhancedPrompt,
      }
    ];

    // 如果有上传的图片，添加到消息内容中
    if (uploadedImage) {
      contentItems.push({
        type: "image_url",
        image_url: {
          url: uploadedImage,
        }
      });
      console.log(`请求包含上传的图片 [requestId=${requestId}]`);
    }

    // 使用OpenAI的chat.completions接口进行多模态处理
    const generatePromise = openai.chat.completions.create({
      model: "gpt-4o-image",
      stream: false,
      messages: [
        {
          role: "user",
          content: contentItems,
        },
      ],
      max_tokens: 1000,
    }).then(response => {
      const elapsed = (performance.now() - startstamp) / 1000;
      console.log(
        `多模态处理完成 [requestId=${requestId}, provider=${provider}, model=${modelId || "gpt-4o-mini"}, elapsed=${elapsed.toFixed(1)}s].`
      );

      // 从响应中获取文本内容
      const textContent = response.choices[0]?.message?.content;
      if (!textContent) {
        throw new Error("OpenAI未返回有效文本响应");
      }
      
      return {
        provider,
        markdown: textContent,
        metadata: {
          ...response,
          elapsed,
        }
      };
    });

    const result = await withTimeout(generatePromise, TIMEOUT_MILLIS);
    return NextResponse.json(result, {
      status: "markdown" in result ? 200 : 500,
    });
  } catch (error: any) {
    console.error(
      `多模态处理错误 [requestId=${requestId}, provider=${provider}, model=${modelId}]: `,
      error
    );
    return NextResponse.json(
      {
        error: "多模态处理失败，请稍后重试。" + (process.env.NODE_ENV === "development" ? ` 错误: ${error.message}` : ""),
      },
      { status: 500 }
    );
  }
}
