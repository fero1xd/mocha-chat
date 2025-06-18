import { api } from "@/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Message } from "./message";

export function Messages() {
  const { threadId } = useParams() as { threadId: string };

  const { data: messages, isPending } = useQuery(
    convexQuery(api.messages.getThreadMessages, {
      threadId,
    })
  );

  // const { messages, status, error } = useChat({
  //   id: threadId,
  //   initialMessages:
  //     convexMessages?.map((message) => ({
  //       id: message._id,
  //       role: message.role,
  //       parts: message.parts,
  //       content: message.content || "",
  //       createdAt: new Date(message._creationTime),
  //     })) ?? [],
  //   experimental_throttle: 50,
  // });

  if (isPending) return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-20 pt-safe-offset-10 overflow-hidden">
      {messages?.map((msg) => (
        <Message
          key={msg.id}
          isStreaming={msg.role === "assistant" && !msg.content}
          msg={msg}
        />
      ))}
      {/* {status === "submitted" ? <MessageLoading /> : null} */}
      {/* {error ? <Error message={error.message} /> : null} */}
    </div>
  );
}
