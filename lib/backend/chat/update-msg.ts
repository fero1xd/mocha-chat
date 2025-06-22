import "server-only";

import * as Sentry from "@sentry/node";
import { api } from "@/convex/_generated/api";
import { convex } from "@/lib/backend/server-convex";
import { OptionalRestArgs } from "convex/server";

export async function updateMessage(
  data: OptionalRestArgs<typeof api.messages.updateMessageContent>[0]
) {
  try {
    await convex.mutation(api.messages.updateMessageContent, data);
  } catch (e) {
    Sentry.captureException(e);
    console.log("updateMessage:faled");
  }
}
