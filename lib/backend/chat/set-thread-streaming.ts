import "server-only";

import { api } from "@/convex/_generated/api";
import { convex } from "@/lib/backend/server-convex";
import * as Sentry from "@sentry/node";

export async function setThreadStreaming(
  threadId: string,
  isStreaming: boolean
) {
  try {
    await convex.mutation(api.threads.updateThreadStreaming, {
      isStreaming,
      threadId,
    });
  } catch (e) {
    Sentry.captureException(e);
    console.log("setThreadStreaming:failed");
  }
}
