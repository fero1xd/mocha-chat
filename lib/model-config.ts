import "server-only";

import { MODELS } from "./models";
import { LanguageModelV1 } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export const MODELS_CONFIG: {
  [x in (typeof MODELS)[number] | (string & {})]: {
    provider: LanguageModelV1;
  };
} = {
  "Gemini 2.5 Flash": {
    provider: google("gemini-2.5-flash-preview-04-17"),
  },
  "GPT 4.1 Nano": {
    provider: openai.responses("gpt-4.1-nano-2025-04-14"),
  },
  "GPT 4o Mini": {
    provider: openai.responses("gpt-4o-mini-2024-07-18"),
  },
  "GPT o4 Mini": {
    provider: openai.responses("o4-mini-2025-04-16"),
  },
} as const;
