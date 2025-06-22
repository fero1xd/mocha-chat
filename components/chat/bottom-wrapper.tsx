import { RefObject, useCallback } from "react";
import { ScrollToBottom } from "../scroll-to-bottom";
import { useInView } from "react-intersection-observer";

export function BottomWrapper({
  isFirstRender,
  localRef,
}: {
  isFirstRender: RefObject<boolean>;
  localRef: RefObject<HTMLDivElement | null>;
}) {
  const { ref: bottomRef, inView } = useInView();
  const setRefs = useCallback(
    (node: HTMLDivElement) => {
      localRef.current = node;
      bottomRef(node);
    },
    [bottomRef, localRef]
  );

  return (
    <>
      <div ref={setRefs} className="min-h-[calc(100vh-20rem)]"></div>
      <div className="pointer-events-none z-20 sticky bottom-34 w-full px-2">
        <ScrollToBottom
          scrollToBottom={() => {
            localRef.current?.scrollIntoView({ behavior: "instant" });
          }}
          inView={inView || isFirstRender.current}
        />
      </div>
    </>
  );
}
