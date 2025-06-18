import { ChatInput } from "@/components/chat-input";
import { Messages } from "@/components/chat/messages";
import { Topbar } from "@/components/chat/topbar";
import { ScrollToBottom } from "@/components/scroll-to-bottom";
import { useRef } from "react";

export function ChatPage() {
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Topbar />
      <div className="p-4 pt-0 flex h-full w-full flex-col pb-[30px] overflow-y-auto">
        <div className="flex-1 pt-12 max-sm:pt-14 pb-[122px]">
          <Messages
            scrollToBottom={() => {
              bottomRef.current?.scrollIntoView({ behavior: "instant" });
              bottomRef.current?.classList.remove("min-h-[calc(100vh-20rem)]");
            }}
          />
          <div ref={bottomRef} className="min-h-[calc(100vh-20rem)]"></div>
        </div>
      </div>

      <div className="pointer-events-none z-10 absolute bottom-0 w-full px-2">
        <ScrollToBottom ref={bottomRef} />
        <ChatInput />
      </div>
    </>
  );
}
