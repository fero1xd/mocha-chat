import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ModelSwitcher } from "./model-switcher";

export function ChatInput() {
  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col text-center">
      <div className="pointer-events-auto bg-secondary/[0.2] p-2 pb-0 backdrop-blur-lg rounded-t-xl">
        <div className="bg-background/[0.5] flex flex-col gap-2 p-2 rounded-t-xl border border-b-0 border-white/5">
          <div className="flex flex-grow flex-row items-start max-h-40">
            <Textarea
              placeholder="Type your message here."
              className="resize-none border-none rounded-b-none focus-visible:outline-none focus-visible:ring-0 dark:bg-transparent"
            />
          </div>

          <div className="flex items-center justify-between w-full">
            <ModelSwitcher />
            <Button className="ml-auto" size="icon">
              <ArrowUp />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
