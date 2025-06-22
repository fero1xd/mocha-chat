import "server-only";

import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

export const MODELS_CONFIG: {
  [x in string & {}]: {
    provider: LanguageModelV1;
  };
} = {
  "Gemini 2.5 flash": {
    provider: google("gemini-2.5-flash-preview-04-17"),
  },
  "GPT 4.1 nano": {
    provider: openai.responses("gpt-4.1-nano-2025-04-14"),
  },
  "GPT 4o mini": {
    provider: openai.responses("gpt-4o-mini-2024-07-18"),
  },
  "GPT o4 mini": {
    provider: openai.responses("o4-mini-2025-04-16"),
  },
} as const;
