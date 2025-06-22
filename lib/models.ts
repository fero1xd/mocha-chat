import { Gemini } from "@/components/icons/gemini";
import OpenAI from "@/components/icons/openai";

type ModelCaps = "reasoning" | "vision";
export type Providers = "openai" | "google";

type Model = {
  name: string;
  icon: React.FC;
  caps: ModelCaps[];
};

type Non0Len<T> = [T, ...T[]];

const defaultModel: Model = {
  name: "Gemini 2.5 flash",
  icon: Gemini,
  caps: ["vision", "reasoning"].sort() as ModelCaps[],
};

export const MODELS: Record<Providers, Non0Len<Model>> = {
  openai: [
    {
      name: "GPT o4 mini",
      icon: OpenAI,
      caps: ["reasoning", "vision"].sort() as ModelCaps[],
    },
    {
      name: "GPT 4.1 nano",
      icon: OpenAI,
      caps: ["vision"],
    },
    {
      name: "GPT 4o mini",
      icon: OpenAI,
      caps: ["vision"],
    },
  ],
  google: [defaultModel],
} as const;

export const MODEL_NAMES = Object.values(MODELS)
  .map((val) => val.map((model) => model.name))
  .flat();

export const DEFAULT_MODEL = defaultModel.name;

export const PROVIDER_NAME_MAP: Record<keyof typeof MODELS, string> = {
  google: "Google",
  openai: "OpenAI",
};
