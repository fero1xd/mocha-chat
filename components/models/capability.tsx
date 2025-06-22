import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function ModelCapability(props: { icon: ReactNode; name: string }) {
  const cn =
    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 p-1";
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={cn}>{props.icon}</div>
      </TooltipTrigger>
      <TooltipContent>{props.name}</TooltipContent>
    </Tooltip>
  );
}
