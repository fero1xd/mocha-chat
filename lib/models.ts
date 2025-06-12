export const MODELS = [
    "Gemini 2.5 Flash",
    "Gemini 2.5 Pro",
] as const;



export type ModelType = typeof MODELS[number];