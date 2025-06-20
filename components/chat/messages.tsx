import { api } from "@/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Ref, RefObject, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Message } from "./message";

export function Messages({
  scrollToBottom,
  isFirstRender,
}: {
  scrollToBottom: () => void;
  isFirstRender: RefObject<boolean>;
}) {
  const { threadId } = useParams() as { threadId: string };

  const { data: messages } = useQuery(
    convexQuery(api.messages.getThreadMessages, {
      threadId,
    })
  );

  const [initialMessageLength, setIniLength] = useState<number | null>(null);

  useEffect(() => {
    if (!messages?.length) return;

    if (initialMessageLength === null) {
      setIniLength(messages.length);
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      scrollToBottom();
    }

    const isWaitingForAssistant =
      messages[messages.length - 1].role === "assistant" &&
      messages[messages.length - 1].content === "";

    if (isWaitingForAssistant) {
      scrollToBottom();
    }
  }, [messages, initialMessageLength]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-20 pt-safe-offset-10 overflow-hidden">
      {messages?.map((msg, index) => (
        <Message
          key={msg.id}
          msg={msg}
          isLast={
            initialMessageLength !== messages.length &&
            messages.length - 1 === index
          }
        />
      ))}
    </div>
  );
}
