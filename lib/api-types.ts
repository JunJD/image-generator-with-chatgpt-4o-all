import { ProviderKey } from "./provider-config";

export interface GenerateImageRequest {
  prompt: string;
  provider: ProviderKey;
  modelId: string;
  uploadedImage?: string | null; // Base64编码的图片数据
}

export interface GenerateImageResponse {
  image?: string;
  markdown?: string;
  error?: string;
}
