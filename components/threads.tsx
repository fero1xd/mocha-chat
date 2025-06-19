import { Doc } from "@/convex/_generated/dataModel";
import { useThreads } from "@/hooks/use-threads";
import { cn, lowerCaseIncludes } from "@/lib/utils";
import { useThreadsSearch } from "@/stores/use-thread-search";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router";
import { ThreadActionMenu } from "./thread-action";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export function Threads() {
  const threads = useThreads();
  const { threadId } = useParams();
  const selectedThread = useMemo(() => {
    if (threadId) {
      return threads.find((th) => th.id === threadId);
    }
  }, [threadId, threads]);

  const threadSearch = useThreadsSearch((s) => s.search);

  const { pinned, today, yesterday, older } = useMemo(() => {
    const now = new Date(Date.now());
    const oneDayInMs = 60 * 60 * 24 * 1000;

    const obj = {
      pinned: threads.filter((th) => th.pinned),
      today: threads.filter(
        (th) => now.getTime() - th.lastMessageAt < oneDayInMs && !th.pinned
      ),
      yesterday: threads.filter((th) => {
        if (th.pinned) return false;
        const lastMsg = new Date(th.lastMessageAt);
        const diffMs = now.getTime() - lastMsg.getTime();

        const oneDayInMs = 60 * 60 * 24 * 1000;
        const twoDayInMs = oneDayInMs * 2;

        return diffMs > oneDayInMs && diffMs < twoDayInMs;
      }),
      older: threads.filter((th) => {
        if (th.pinned) return false;
        const lastMsg = new Date(th.lastMessageAt);
        return now.getDate() - lastMsg.getDate() > 1;
      }),
    };

    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => {
        return [
          key,
          val.filter((th) => lowerCaseIncludes(th.title, threadSearch)),
        ];
      })
    );
  }, [threads, threadSearch]);

  const categorizedThreads = useMemo(() => {
    return [
      ["Pinned", pinned],
      ["Today", today],
      ["Yesterday", yesterday],
      ["Older", older],
    ] as const;
  }, [today, yesterday, older]);

  return (
    <SidebarContent>
      {categorizedThreads.map(([title, threads]) =>
        threads.length > 0 ? (
          <SidebarGroup key={title}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {threads.map((th) => (
                  <SingleThread
                    thread={th}
                    selectedThread={selectedThread}
                    key={th.id}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null
      )}
    </SidebarContent>
  );
}

function SingleThread({
  selectedThread,
  thread,
}: {
  selectedThread?: Doc<"threads">;
  thread: Doc<"threads">;
}) {
  const isActive = selectedThread?.id === thread.id;
  return (
    <SidebarMenuItem className="relative">
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          to={`/${thread.id}`}
          className={cn(isActive && !thread.isStreaming && "pr-10 truncate")}
        >
          <span>{thread.title}</span>
        </Link>
      </SidebarMenuButton>
      {isActive && (
        <ThreadActionMenu
          threadId={thread.id}
          title={thread.title}
          pinned={thread.pinned}
        />
      )}

      {thread.isStreaming ? (
        <SidebarMenuAction className="transition-opacity duration-75 ease-in-out z-20 gap-2">
          <Loader2 className="animate-spin" />
        </SidebarMenuAction>
      ) : isActive ? (
        <div className="absolute right-0 top-0 h-full flex items-center justify-end w-12 bg-gradient-to-l from-muted to-sidebar-accent pr-2 rounded-r-md">
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex  items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      ) : null}
    </SidebarMenuItem>
  );
}
