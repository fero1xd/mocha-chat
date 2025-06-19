import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
  role: "user" | "assistant";
  content: string;
};

export function ChatAction({ role, content }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code to clipboard:", error);
    }
  };

  return (
    <div
      className={cn(
        "absolute mt-5 flex items-center gap-1",
        "opacity-0 transition-opacity group-focus-within:opacity-100",
        "group-hover:opacity-100 group-focus:opacity-100",
        role === "assistant" ? "left-0" : "right-0"
      )}
    >
      {/* <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost">
            <RefreshCcw className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Retry message</TooltipContent>
      </Tooltip> */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" onClick={copyToClipboard}>
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Copy message</TooltipContent>
      </Tooltip>
    </div>
  );
}
