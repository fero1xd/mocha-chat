import { ChatInput } from "@/components/chat-input";
import { Messages } from "@/components/chat/messages";
import { Topbar } from "@/components/chat/topbar";

export function ChatPage() {
  return (
    <>
      <div className="p-4 pt-0 flex h-full w-full flex-col overflow-y-scroll pb-[30px]">
        <Topbar />

        <div className="flex-1 pt-12 max-sm:pt-14 pb-[122px] ">
          <Messages />
        </div>
      </div>

      <div className="pointer-events-none z-10 absolute bottom-0 w-full px-2">
        <ChatInput />
      </div>
    </>
  );
}
