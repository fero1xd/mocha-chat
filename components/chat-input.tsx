import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/use-jwt";
import { generateStream } from "@/lib/chat/generate-stream";
import { useChatbox } from "@/stores/chatbox";
import { useConvex, useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import { nanoid } from "nanoid";
import { useNavigate, useParams } from "react-router";
import { ModelSwitcher } from "./model-switcher";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Id } from "@/convex/_generated/dataModel";
import { useModals } from "@/stores/use-modals";
import posthog from "posthog-js";
import { useModel } from "@/stores/model";

export function ChatInput() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const convex = useConvex();

  const { realUser, isRealLoading } = useUser();
  const setAuthModal = useModals((s) => s.setAuth);

  const addMessageMutation = useMutation({
    mutationFn: useConvexMutation(
      api.messages.addMessagesToThread
    ).withOptimisticUpdate((localStore, args) => {
      if (!realUser) return;
      const existingThreadMessages = localStore.getQuery(
        api.messages.getThreadMessages,
        {
          threadId: args.threadId,
        }
      );

      localStore.setQuery(
        api.messages.getThreadMessages,
        {
          threadId: args.threadId,
        },
        [
          ...(existingThreadMessages ?? []),
          ...args.messages.map((msg) => ({
            _id: crypto.randomUUID() as Id<"messages">,
            _creationTime: Date.now(),
            threadId: args.threadId,
            ...msg,
          })),
        ]
      );
    }),
  });

  const onSubmit = async () => {
    // we save re renders this way
    const { prompt, setPrompt } = useChatbox.getState();
    if (!prompt) return;
    if (!realUser) {
      setAuthModal(true);
      return;
    }

    const threadIdToUse = threadId || nanoid();
    if (!threadId) {
      navigate(`/${threadIdToUse}`);
    }

    const prevString = prompt;

    try {
      setPrompt("");

      const assistantMsgId = nanoid();
      const userMessage = {
        id: nanoid(),
        content: prompt,
        role: "user" as const,
      };

      const isNewThread = threadId !== threadIdToUse;

      posthog.capture("chat-generate", {
        threadIdToUse,
        prompt,
        model: useModel.getState().model,
        isNewThread,
      });

      const chatHistory = isNewThread
        ? []
        : await convex.query(api.messages.getThreadMessages, {
            threadId: threadIdToUse,
          });

      await addMessageMutation.mutateAsync({
        threadId: threadIdToUse,
        messages: [
          userMessage,
          {
            id: assistantMsgId,
            content: "",
            role: "assistant",
          },
        ],
      });

      const historyToSend = chatHistory.map(({ content, role, id }) => ({
        id,
        content,
        role,
      }));
      historyToSend.push(userMessage);

      generateStream({
        messages: historyToSend,
        messageId: assistantMsgId,
        threadId: threadIdToUse,
      });
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
              disabled={addMessageMutation.isPending || isRealLoading}
              onClick={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InputBox({ onSubmit }: { onSubmit: () => unknown }) {
  const { prompt, setPrompt, inputRef } = useChatbox();

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
      ref={inputRef}
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
