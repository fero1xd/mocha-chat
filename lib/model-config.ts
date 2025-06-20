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
  "GPT 4o Mini": {
    provider: openai("gpt-4o-mini-2024-07-18"),
  },
  "GPT 4o Mini Search": {
    provider: openai("gpt-4o-mini-search-preview-2025-03-11"),
  },
} as const;
