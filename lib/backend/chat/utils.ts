import "server-only";
import { CoreMessage, Message } from "ai";

export function getFirstChatMessage(
  messages: CoreMessage[] | Omit<Message, "id">[]
) {
  if (messages.length === 1 && messages[0].role === "user") {
    return messages[0].content as string;
  }

  return null;
}
