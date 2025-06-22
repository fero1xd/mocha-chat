import "server-only";

import { PostHog } from "posthog-node";

export const phNode = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
});

export function captureGeneration(data: {
  id: string;
  threadId: string;
  model: string;
}) {
  const { id, threadId, model } = data;
  return phNode.capture({
    distinctId: id,
    event: "chat-generate",
    properties: {
      threadId,
      model,
    },
  });
}
