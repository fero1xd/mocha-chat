import { ChatInput } from "@/components/chat-input";
import { Topbar } from "@/components/chat/topbar";
import { Startup } from "@/components/home/startup";
import { useChatbox } from "@/stores/chatbox";
import { useShallow } from "zustand/react/shallow";

export function HomePage() {
  const [setPrompt, ref] = useChatbox(
    useShallow((s) => [s.setPrompt, s.inputRef])
  );

  return (
    <>
      <div className="p-4 pt-0 flex h-full w-full flex-col overflow-y-auto">
        <Topbar />

        <div className="flex-1 pt-12 max-sm:pt-14 pb-[122px] ">
          <Startup
            onSelect={(v) => {
              setPrompt(v);
              ref.current?.focus();
            }}
          />
        </div>
      </div>

      <div className="pointer-events-none z-10 absolute bottom-0 w-full px-2">
        <ChatInput />
      </div>
    </>
  );
}
