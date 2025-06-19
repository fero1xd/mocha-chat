export const MODELS = [
    "Gemini 2.5 Flash",
    "OpenAI GPT 4o Mini"
] as const;


export type ModelType = typeof MODELS[number];