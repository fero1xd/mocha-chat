import { RefObject } from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { useOnScreen } from "@/hooks/use-on-screen";

type Props = {
  ref: RefObject<HTMLDivElement | null>;
};

export function ScrollToBottom({ ref }: Props) {
  const isVisible = useOnScreen(ref);
  if (isVisible) return null;

  return (
    <div className="w-full sticky bottom-30 bg- flex items-center justify-center pointer-events-none z-20">
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
