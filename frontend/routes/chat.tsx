import { ChatInput } from "@/components/chat-input";
import { Messages } from "@/components/chat/messages";
import { Topbar } from "@/components/chat/topbar";
import { ScrollToBottom } from "@/components/scroll-to-bottom";
import { useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";

export function ChatPage() {
  const { ref: bottomRef, inView } = useInView();
  const localRef = useRef<HTMLDivElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLDivElement) => {
      localRef.current = node;
      bottomRef(node);
    },
    [bottomRef]
  );

  return (
    <>
      <Topbar />
      <div className="p-4 pt-0 flex h-full w-full flex-col pb-[30px] overflow-y-auto">
        <div className="flex-1 pt-12 max-sm:pt-14 pb-[122px]">
          <Messages
            scrollToBottom={() => {
              console.log("scroll to bottom");
              localRef.current?.scrollIntoView({ behavior: "instant" });
              localRef.current?.classList.remove("min-h-[calc(100vh-20rem)]");
            }}
          />
          <div ref={setRefs} className="min-h-[calc(100vh-20rem)]"></div>
        </div>
      </div>

      <div className="pointer-events-none z-10 absolute bottom-0 w-full px-2">
        <ScrollToBottom
          scrollToBottom={() => {
            localRef.current?.scrollIntoView({ behavior: "instant" });
          }}
          inView={inView}
        />
        <ChatInput />
      </div>
    </>
  );
}
