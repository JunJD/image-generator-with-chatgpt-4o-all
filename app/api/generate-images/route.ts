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
  const { prompt, provider, modelId } =
    (await req.json()) as GenerateImageRequest;

  try {
    if (!prompt || provider !== "openai") {
      const error = "无效请求参数，目前仅支持OpenAI提供商";
      console.error(`${error} [requestId=${requestId}]`);
      return NextResponse.json({ error }, { status: 400 });
    }

    const startstamp = performance.now();

    // 使用OpenAI的chat.completions接口进行多模态处理
    const generatePromise = openai.chat.completions.create({
      model: "gpt-4o-image",
      stream: false,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `A Ghibli-style portrait of a person based on a detailed appearance description, whimsical and soft colors, intricate background with nature elements`,
            },
            {
              type: "image_url",
              image_url: {
                url: "https://filesystem.site/cdn/20250329/HF96hKiD9wgDx0wJocaefTlUSPYveh.jpeg",
              }
            }
          ],
        },
      ],
    }).then(response => {
      const elapsed = (performance.now() - startstamp) / 1000;
      console.log(
        `多模态处理完成 [requestId=${requestId}, provider=${provider}, model=${modelId || "gpt-4o"}, elapsed=${elapsed.toFixed(1)}s].`
      );

      console.log('OpenAI响应结构:', response);

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
