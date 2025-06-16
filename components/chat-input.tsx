import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@/hooks/use-jwt";
import { createUserMessage } from "@/lib/chat/messages";
import { useChatbox } from "@/stores/chatbox";
import { useModel } from "@/stores/model";
import { useChat } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { ModelSwitcher } from "./model-switcher";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

function memoizeStatusAndAppend(threadId?: string) {
  const { status, append } = useChat({
    id: threadId,
  });
  return useMemo(() => ({ status, append }), [status, append, threadId]);
}

export function ChatInput() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { status, append } = memoizeStatusAndAppend(threadId);

  const { realUser } = useUser();

  const addMessageMutation = useMutation({
    mutationFn: useConvexMutation(api.messages.addMessageToThread),
    // .withOptimisticUpdate((localStore, args) => {
    //   const existingThreadMessages = localStore.getQuery(
    //     api.messages.getThreadMessages,
    //     {
    //       threadId: args.threadId,
    //     }
    //   );

    //   if (existingThreadMessages && realUser) {
    //     const newMsg = {
    //       _id: crypto.randomUUID() as Id<"messages">,
    //       _creationTime: Date.now(),
    //       userId: realUser.id,
    //       ...args,
    //     };
    //     console.log("adding local message", { newMsg });
    //     localStore.setQuery(
    //       api.messages.getThreadMessages,
    //       {
    //         threadId: args.threadId,
    //       },
    //       [...existingThreadMessages, newMsg]
    //     );
    //   }
    // }),
  });

  const onSubmit = async () => {
    // we save re renders this way
    const { prompt, setPrompt } = useChatbox.getState();
    const { model } = useModel.getState();
    if (!prompt || !realUser) return;

    const threadIdToUse = threadId || nanoid();
    if (!threadId) {
      navigate(`/${threadIdToUse}`);
    }

    const userMsg = createUserMessage(prompt);
    const { content, role, parts } = userMsg;
    const prevString = prompt;

    try {
      setPrompt("");
      // 1. Creating user message in convex
      await addMessageMutation.mutateAsync({
        threadId: threadIdToUse,
        content,
        role,
        parts,
      });

      // 2. This will call /api/chat and start streaming back to the ui
      append(userMsg, {
        body: {
          model,
          threadId,
        },
      });

      // 3. nothing more to do, backend will automatically store the entire message in db
    } catch (e) {
      console.log(e);
      setPrompt(prevString);
    }
  };

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col text-center">
      <div className="pointer-events-auto bg-secondary/[0.2] p-2 pb-0 backdrop-blur-lg rounded-t-xl">
        <div className="bg-background/[0.5] flex flex-col gap-2 p-2 rounded-t-xl border border-b-0 border-white/5">
          <div className="flex flex-grow flex-row items-start max-h-[500px]">
            <InputBox onSubmit={onSubmit} />
          </div>

          <div className="flex items-center justify-between w-full">
            <ModelSwitcher />
            <SendButton
              disabled={
                status === "streaming" ||
                status === "submitted" ||
                addMessageMutation.isPending
              }
              onClick={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InputBox({ onSubmit }: { onSubmit: () => unknown }) {
  const { prompt, setPrompt } = useChatbox();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      onKeyDown={handleKeyDown}
      maxRows={9}
      placeholder="Type your message here."
      className="resize-none border-none rounded-b-none focus-visible:outline-none focus-visible:ring-0 dark:bg-transparent"
    />
  );
}

function SendButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => unknown;
}) {
  const prompt = useChatbox((s) => s.prompt);
  const isDisabled = !prompt.trim() || disabled;

  return (
    <Button
      className="ml-auto"
      size="icon"
      type="submit"
      disabled={isDisabled}
      onClick={onClick}
    >
      <ArrowUp />
    </Button>
  );
}
