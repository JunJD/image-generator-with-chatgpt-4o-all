import { ProviderKey } from "./provider-config";

export interface GeneratedImage {
  provider: ProviderKey;
  markdown: string | null;
  modelId?: string;
}

export interface ImageResult {
  provider: ProviderKey;
  markdown: string | null;
  modelId?: string;
}

export interface ImageError {
  provider: ProviderKey;
  message: string;
}

export interface ProviderTiming {
  startTime?: number;
  completionTime?: number;
  elapsed?: number;
}
