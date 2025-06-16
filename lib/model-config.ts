import "server-only";

import { MODELS } from "./models";
import { LanguageModelV1 } from "ai";
import { google } from "@ai-sdk/google";

export const MODELS_CONFIG: {
    [x in typeof MODELS[number] | (string & {})]: {
        provider: LanguageModelV1
    }
} = {
    'Gemini 2.5 Flash': {
        provider: google("gemini-2.5-flash-preview-04-17"),
    }, 'Gemini 2.5 Pro': {
        provider: google("gemini-2.5-pro-exp-03-25"),
    }
} as const;
