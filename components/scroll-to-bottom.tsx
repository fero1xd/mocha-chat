import { RefObject } from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { useOnScreen } from "@/hooks/use-on-screen";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

type Props = {
  ref: RefObject<HTMLDivElement | null>;
  className?: ClassValue;
};

export function ScrollToBottom({ ref, className }: Props) {
  const isVisible = useOnScreen(ref);
  if (isVisible) {
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
        onClick={() => ref.current?.scrollIntoView({ behavior: "instant" })}
      >
        Scroll to bottom <ChevronDown />
      </Button>
    </div>
  );
}
