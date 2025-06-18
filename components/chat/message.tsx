import { Doc } from "@/convex/_generated/dataModel";
import { useCurrentGeneration } from "@/stores/use-current-generation";
import { ChatAction } from "./chat-action";
import MemoizedMarkdown from "./markdown";
import Reasoning from "./reasoning";
import { memo } from "react";

type Props = {
  msg: Doc<"messages">;
  isStreaming: boolean;
};

function RawMessage({ msg, isStreaming }: Props) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="group relative inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left">
          <p>{msg.content}</p>
          <ChatAction role="user" />
        </div>
      </div>
    );
  }

  if (!msg.content) return <LocalAssistantMessage msg={msg} />;

  return (
    <div className="flex justify-start">
      <div className="group relative w-full max-w-full break-words">
        {msg.reasoning ? (
          <Reasoning id={msg.id} reasoning={msg.reasoning} />
        ) : null}
        <MemoizedMarkdown content={msg.content} id={msg.id} />

        {<ChatAction role="assistant" />}
      </div>
    </div>
  );
}

function LocalAssistantMessage({ msg }: { msg: Doc<"messages"> }) {
  const localMsgs = useCurrentGeneration((s) => s.messages);
  const localContent = localMsgs.find((c) => c.id === msg.id);
  return (
    <div className="flex justify-start">
      <div className="group relative w-full max-w-full break-words">
        {msg.reasoning ? (
          <Reasoning id={msg.id} reasoning={msg.reasoning} />
        ) : null}
        <MemoizedMarkdown
          content={localContent ? localContent.text : msg.content}
          id={msg.id}
        />
        {<ChatAction role="assistant" />}
      </div>
    </div>
  );
}

export const Message = memo(RawMessage, (prev, next) => {
  if (prev.isStreaming !== next.isStreaming) return false;
  if (prev.msg.id !== next.msg.id) return false;
  if (prev.msg.content !== next.msg.content) return false;
  return true;
});
