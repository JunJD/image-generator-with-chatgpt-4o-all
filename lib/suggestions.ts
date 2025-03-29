export interface Suggestion {
  text: string;
  prompt: string;
}

// 定义艺术风格常量
export const STYLE_NAMES = {
  NONE: "无风格",      // No style
  MIYAZAKI: "宫崎骏",  // Miyazaki Hayao style
  PIXAR: "皮克斯",     // Pixar style
  LEGO: "乐高",        // Lego style
  ANIME: "动漫",       // Anime style
  SHINKAI: "新海诚",   // Makoto Shinkai style
  DISNEY: "迪士尼",    // Disney style
  OILPAINTING: "油画", // Oil painting style
  CUSTOM: "自定义",    // Custom style
};

// 艺术风格对应的英文描述(取代basePrompts)
export const STYLE_PROMPTS = {
  [STYLE_NAMES.NONE]: "Keep the content of the original image but enhance its quality and details. Maintain the same composition, subjects, and elements from the uploaded image.",
  [STYLE_NAMES.MIYAZAKI]: "Transform the uploaded image into Studio Ghibli and Hayao Miyazaki style, with soft colors and dreamy landscapes. Maintain all the key subjects and composition from the original image.",
  [STYLE_NAMES.PIXAR]: "Convert the uploaded image into Pixar animation style, with vibrant colors and expressive characters. Preserve all the key elements and composition from the original image.",
  [STYLE_NAMES.LEGO]: "Recreate the uploaded image as if made of LEGO bricks, with colorful plastic blocks. Keep all key subjects and composition from the original image intact.",
  [STYLE_NAMES.ANIME]: "Transform the uploaded image into anime style, with vibrant colors and expressive characters. Maintain all key subjects and composition from the original image.",
  [STYLE_NAMES.SHINKAI]: "Convert the uploaded image to Makoto Shinkai style, with photorealistic backgrounds and atmospheric lighting. Preserve all key elements and composition from the original image.",
  [STYLE_NAMES.DISNEY]: "Transform the uploaded image into Disney animation style, with cheerful characters and enchanting scenery. Keep all key subjects and composition from the original image.",
  [STYLE_NAMES.OILPAINTING]: "Recreate the uploaded image as an oil painting, with textured brushstrokes and classical composition. Maintain all the key elements and composition from the original image.",
  [STYLE_NAMES.CUSTOM]: "",
};

// 获取提示函数，直接返回风格提示
export function getSuggestionsByStyle(style: string): Suggestion[] {
  const stylePrompt = STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS] || "";
  
  if (!stylePrompt && style !== STYLE_NAMES.CUSTOM) {
    return [{ text: "默认提示", prompt: "Recreate the uploaded image with enhanced quality while preserving all original content and composition." }];
  }
  
  return [{
    text: style,
    prompt: stylePrompt
  }];
}

// 保留原有函数，但使用默认风格（宫崎骏）
export function getRandomSuggestions(): Suggestion[] {
  return getSuggestionsByStyle(STYLE_NAMES.MIYAZAKI);
}