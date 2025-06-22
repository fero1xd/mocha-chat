import { Message as TMessage } from "@/convex/types";
import { useCurrentGeneration } from "@/stores/use-current-generation";
import { ChatAction } from "./chat-action";
import MemoizedMarkdown from "./markdown";
import Reasoning from "./reasoning";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { MessageLoading } from "./loading";
import { Error } from "./error";

type Props = {
  msg: TMessage;
  isLast: boolean;
};

function RawMessage({ msg, isLast }: Props) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end user-msg">
        <div className="group relative inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left">
          <MemoizedMarkdown
            content={msg.content}
            id={msg.id}
            className="whitespace-pre-line"
          />
          <ChatAction role="user" content={msg.content} />
        </div>
      </div>
    );
  }

  if (msg.status === "waiting" || msg.status === "streaming")
    return <LocalAssistantMessage msg={msg} />;

  return (
    <div
      className={cn(
        "flex justify-start",
        isLast ? "min-h-[calc(100vh-23rem)]" : null
      )}
    >
      <div className="group relative w-full max-w-full break-words">
        {msg.reasoning ? (
          <Reasoning id={msg.id} reasoning={msg.reasoning} isDone />
        ) : null}
        {msg.status !== "error" && (
          <MemoizedMarkdown content={msg.content} id={msg.id} />
        )}
        {msg.status === "error" ? <Error message={msg.content} /> : null}
        <ChatAction role="assistant" content={msg.content} model={msg.model} />
      </div>
    </div>
  );
}

function LocalAssistantMessage({ msg }: { msg: TMessage }) {
  const localMsgs = useCurrentGeneration((s) => s.messages);
  const localContent = localMsgs.find((c) => c.id === msg.id);
  if (!localContent) return <></>;

  const { isDone, text, reasoning, error } = localContent;

  const successfulyDone = isDone && !error && text;
  const isWaiting = msg.status === "waiting" && !text && !error;
  return (
    <div className={cn("flex justify-start", "last:min-h-[calc(100vh-23rem)]")}>
      <div className="group relative w-full max-w-full break-words">
        {isWaiting && <MessageLoading />}
        {reasoning ? (
          <Reasoning
            id={msg.id}
            reasoning={reasoning}
            isDone={isDone || !!text || !!error}
          />
        ) : null}
        {!error && <MemoizedMarkdown content={text} id={msg.id} />}
        {error ? <Error message={error} /> : null}
        {successfulyDone ? (
          <ChatAction role="assistant" content={text} model={msg.model} />
        ) : null}
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
