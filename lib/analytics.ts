import posthog from "posthog-js";

export const captureChatGenerate = (data: {
  threadId: string;
  model: string;
}) => {
  posthog.capture("chat-generate", data);
};
