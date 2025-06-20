export const MODELS = [
  "Gemini 2.5 Flash",
  "GPT 4o Mini",
  "GPT 4o Mini Search",
] as const;

export type ModelType = (typeof MODELS)[number];
