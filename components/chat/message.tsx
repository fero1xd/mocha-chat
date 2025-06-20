import { Doc } from "@/convex/_generated/dataModel";
import { useCurrentGeneration } from "@/stores/use-current-generation";
import { ChatAction } from "./chat-action";
import MemoizedMarkdown from "./markdown";
import Reasoning from "./reasoning";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { MessageLoading } from "./loading";
import { Error } from "./error";

type Props = {
  msg: Doc<"messages">;
  isLast: boolean;
};

function RawMessage({ msg, isLast }: Props) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="group relative inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left">
          <p>{msg.content}</p>
          <ChatAction role="user" content={msg.content} />
        </div>
      </div>
    );
  }

  if (!msg.content) return <LocalAssistantMessage msg={msg} />;

  return (
    <div
      className={cn(
        "flex justify-start",
        isLast ? "min-h-[calc(100vh-23rem)]" : null
      )}
    >
      <div className="group relative w-full max-w-full break-words">
        {msg.reasoning ? (
          <Reasoning id={msg.id} reasoning={msg.reasoning} />
        ) : null}
        <MemoizedMarkdown content={msg.content} id={msg.id} />

        <ChatAction role="assistant" content={msg.content} />
      </div>
    </div>
  );
}

function LocalAssistantMessage({ msg }: { msg: Doc<"messages"> }) {
  const localMsgs = useCurrentGeneration((s) => s.messages);
  const localContent = localMsgs.find((c) => c.id === msg.id);
  if (!localContent) return <></>;

  const { isDone, text, reasoning, error } = localContent;

  const successfulyDone = isDone && !error && text;

  const hasAnything = error || text || reasoning;

  return (
    <div className={cn("flex justify-start", "last:min-h-[calc(100vh-23rem)]")}>
      <div className="group relative w-full max-w-full break-words">
        {!hasAnything && !isDone && <MessageLoading />}
        {reasoning ? <Reasoning id={msg.id} reasoning={reasoning} /> : null}
        <MemoizedMarkdown
          content={localContent ? localContent.text : msg.content}
          id={msg.id}
        />
        {successfulyDone ? (
          <ChatAction role="assistant" content={localContent.text} />
        ) : null}
        {localContent?.error ? <Error message={localContent.error} /> : null}
      </div>
    </div>
  );
}

export const Message = memo(RawMessage, (prev, next) => {
  if (prev.msg.id !== next.msg.id) return false;
  if (prev.msg.content !== next.msg.content) return false;
  if (prev.isLast !== next.isLast) return false;
  return true;
});
