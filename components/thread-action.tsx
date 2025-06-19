import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Copy, Pin, PinOff, Trash } from "lucide-react";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { useAuthMutation } from "@/hooks/use-auth-mutation";

export function ThreadActionMenu({
  threadId,
  title,
  pinned,
}: {
  threadId: string;
  title: string;
  pinned?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const copyThreadTitle = () => {
    window.navigator.clipboard.writeText(title);
  };

  const deleteThreadMutation = useAuthMutation({
    mutationFn: useConvexMutation(
      api.threads.deleteThread
    ).withOptimisticUpdate((localStore, args) => {
      const localThreads = localStore.getQuery(api.threads.getThreads);
      if (!localThreads) return;
      localStore.setQuery(api.threads.getThreads, {}, [
        ...localThreads.filter((th) => th.id !== args.threadId),
      ]);
    }),
  });

  const pinThreadMutation = useAuthMutation({
    mutationFn: useConvexMutation(
      api.threads.setThreadPin
    ).withOptimisticUpdate((localStore, args) => {
      const localThreads = localStore.getQuery(api.threads.getThreads);
      if (!localThreads) return;
      localStore.setQuery(api.threads.getThreads, {}, [
        ...localThreads.map((th) =>
          th.id === args.threadId ? { ...th, pinned: true } : th
        ),
      ]);
    }),
  });

  const deleteThread = async () => {
    navigate("/");
    setOpen(false);
    await deleteThreadMutation.mutateAsync({ threadId });
  };

  const setThreadPin = async (label: string) => {
    console.log(label);
    setOpen(false);
    await pinThreadMutation.mutateAsync({ threadId, pin: !pinned });
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="pointer-events-auto"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem
            className="cursor-pointer rounded-lg"
            onSelect={setThreadPin}
          >
            {pinned ? (
              <PinOff className="w-4 h-4" />
            ) : (
              <Pin className="w-4 h-4" />
            )}
            {pinned ? "Unpin" : "Pin"}
          </CommandItem>
          <CommandItem
            onSelect={() => {
              copyThreadTitle();
              setOpen(false);
            }}
            className="cursor-pointer rounded-lg"
          >
            <Copy className="w-4 h-4" /> Copy Thread Title
          </CommandItem>
          <CommandItem
            className="cursor-pointer rounded-lg"
            onSelect={deleteThread}
          >
            <Trash className="w-4 h-4" />
            Delete Thread
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
