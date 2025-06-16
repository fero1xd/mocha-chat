import { UIMessage } from "ai";
import { ChatAction } from "./chat-action";
import { memo } from "react";
import equal from "fast-deep-equal";
import MemoizedMarkdown from "./markdown";

type Props = {
  msg: UIMessage;
  isStreaming: boolean;
};

function RawMessage({ msg, isStreaming }: Props) {
  return msg.parts.map((part, index) => {
    const { type } = part;
    const key = `message-${msg.id}-part-${index}`;

    if (type === "text") {
      return msg.role === "user" ? (
        <div className="flex justify-end" key={key}>
          <div className="group relative inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left">
            <p>{part.text}</p>
            <ChatAction role="user" />
          </div>
        </div>
      ) : (
        <div className="flex justify-start" key={key}>
          <div className="group relative w-full max-w-full break-words">
            <MemoizedMarkdown content={part.text} id={msg.id} />

            {!isStreaming ? <ChatAction role="assistant" /> : null}
          </div>
        </div>
      );
    }
  });
}

export const Message = memo(RawMessage, (prev, next) => {
  if (prev.isStreaming !== next.isStreaming) return false;
  if (prev.msg.id !== next.msg.id) return false;
  if (!equal(prev.msg.parts, next.msg.parts)) return false;
  return true;
});
