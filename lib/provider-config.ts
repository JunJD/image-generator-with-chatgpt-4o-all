export type ProviderKey = "openai";
export type ModelMode = "performance" | "quality";

export const PROVIDERS: Record<
  ProviderKey,
  {
    displayName: string;
    iconPath: string;
    color: string;
    models: string[];
  }
> = {
  openai: {
    displayName: "OpenAI",
    iconPath: "/provider-icons/openai.svg",
    color: "from-blue-500 to-cyan-500",
    models: ["gpt-4o-all"],
  },
};

export const MODEL_CONFIGS: Record<ModelMode, Record<ProviderKey, string>> = {
  performance: {
    openai: "gpt-4o-all",
  },
  quality: {
    openai: "gpt-4o-all",
  },
};

export const PROVIDER_ORDER: ProviderKey[] = [
  "openai",
];

export const initializeProviderRecord = <T>(defaultValue?: T) =>
  Object.fromEntries(
    PROVIDER_ORDER.map((key) => [key, defaultValue])
  ) as Record<ProviderKey, T>;
