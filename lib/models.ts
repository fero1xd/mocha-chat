export const MODELS = [
  "Gemini 2.5 Flash",
  "GPT 4.1 Nano",
  "GPT 4o Mini",
  "GPT o4 Mini",
] as const;

export type ModelType = (typeof MODELS)[number];
