import { ChatInput } from "@/components/chat-input";
import { BottomWrapper } from "@/components/chat/bottom-wrapper";
import { Messages } from "@/components/chat/messages";
import { Topbar } from "@/components/chat/topbar";
import { useRef } from "react";

export function ChatPage() {
  const localRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  return (
    <>
      <Topbar />
      <div className="px-4 flex flex-1 w-full flex-col  overflow-y-auto relative">
        <div className="flex-1 pt-12 max-sm:pt-14">
          <Messages
            isFirstRender={isFirstRender}
            scrollToBottom={() => {
              localRef.current?.scrollIntoView({ behavior: "instant" });
              localRef.current?.classList.remove("min-h-[calc(100vh-20rem)]");
            }}
          />
        </div>

        <BottomWrapper isFirstRender={isFirstRender} localRef={localRef} />
        <div className="pointer-events-none z-20 sticky bottom-0 w-full px-2">
          <ChatInput />
        </div>
      </div>
    </>
  );
}
