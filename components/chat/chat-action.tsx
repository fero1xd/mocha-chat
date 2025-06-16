import { Button } from "../ui/button";
import { Copy, RefreshCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  role: "user" | "assistant";
};

export function ChatAction({ role }: Props) {
  return (
    <div
      className={cn(
        "absolute mt-5 flex items-center gap-1",
        "opacity-0 transition-opacity group-focus-within:opacity-100",
        "group-hover:opacity-100 group-focus:opacity-100",
        role === "assistant" ? "left-0" : "right-0"
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost">
            <RefreshCcw className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Retry message</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost">
            <Copy className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Copy message</TooltipContent>
      </Tooltip>
    </div>
  );
}
