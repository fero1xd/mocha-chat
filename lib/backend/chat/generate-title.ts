import "server-only";

import * as Sentry from "@sentry/node";
import { generateText } from "ai";
import { MODELS_CONFIG } from "../model-config";
import { convex } from "@/lib/backend/server-convex";
import { api } from "@/convex/_generated/api";

export async function generateTitle(data: {
  prompt: string;
  threadId: string;
}) {
  const { prompt, threadId } = data;
  try {
    const { text } = await generateText({
      model: MODELS_CONFIG["Gemini 2.5 flash"].provider,
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - you should NOT answer the user's message, you should only generate a summary/title
      - do not use quotes or colons`,
      prompt,
    });

    await convex.mutation(api.threads.updateThreadTitle, {
      threadId,
      title: text,
    });
  } catch (err) {
    console.log(err);
    console.log("Generating title failed");
    Sentry.captureException(err);
  }
}
