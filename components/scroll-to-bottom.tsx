import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  inView: boolean;
  className?: ClassValue;
  scrollToBottom: () => void;
};

export function ScrollToBottom({ inView, className, scrollToBottom }: Props) {
  if (inView) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full sticky -translate-y-4 flex items-center justify-center pointer-events-none z-20",
        className
      )}
    >
      <Button
        size="sm"
        variant="secondary"
        className="pointer-events-auto rounded-xl text-xs bg-background border hover:bg-sidebar"
        onClick={scrollToBottom}
      >
        Scroll to bottom <ChevronDown />
      </Button>
    </div>
  );
}
