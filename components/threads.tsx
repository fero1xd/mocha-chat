import { useThreads } from "@/hooks/use-threads";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router";
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

  const { today, yesterday, older } = useMemo(() => {
    const now = new Date(Date.now());
    const oneDayInMs = 60 * 60 * 24 * 1000;

    return {
      today: threads.filter(
        (th) => now.getTime() - th.lastMessageAt < oneDayInMs
      ),
      yesterday: threads.filter((th) => {
        const lastMsg = new Date(th.lastMessageAt);
        const diffMs = now.getTime() - lastMsg.getTime();

        const oneDayInMs = 60 * 60 * 24 * 1000;
        const twoDayInMs = oneDayInMs * 2;

        return diffMs > oneDayInMs && diffMs < twoDayInMs;
      }),
      older: threads.filter((th) => {
        const lastMsg = new Date(th.lastMessageAt);
        return now.getDate() - lastMsg.getDate() > 1;
      }),
    };
  }, [threads]);

  return (
    <SidebarContent>
      {today.length ? (
        <SidebarGroup>
          <SidebarGroupLabel>Today</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {today.map(({ id, title, isStreaming }) => (
                <SidebarMenuItem key={id} className="overflow-hidden">
                  <SidebarMenuButton
                    asChild
                    isActive={selectedThread?.id === id}
                  >
                    <Link to={`/${id}`} className="">
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {isStreaming ? (
                    <SidebarMenuAction className="transition-opacity duration-75 ease-in-out z-20 gap-2">
                      <Loader2 className="animate-spin" />
                    </SidebarMenuAction>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ) : null}

      {yesterday.length ? (
        <SidebarGroup>
          <SidebarGroupLabel>Yesterday</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {yesterday.map(({ id, title, isStreaming }) => (
                <SidebarMenuItem key={id}>
                  <Link to={`/${id}`} className="cursor-pointer">
                    <SidebarMenuButton
                      isActive={selectedThread?.id === id}
                      className="cursor-pointer"
                    >
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </Link>

                  {isStreaming ? (
                    <SidebarMenuAction className="transition-opacity duration-75 ease-in-out z-20 gap-2">
                      <Loader2 className="animate-spin" />
                    </SidebarMenuAction>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ) : null}

      {older.length ? (
        <SidebarGroup>
          <SidebarGroupLabel>Older</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {older.map(({ id, title, isStreaming }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    asChild
                    isActive={selectedThread?.id === id}
                  >
                    <Link to={`/${id}`} className="">
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>

                  {isStreaming ? (
                    <SidebarMenuAction className="transition-opacity duration-75 ease-in-out z-20 gap-2">
                      <Loader2 className="animate-spin" />
                    </SidebarMenuAction>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ) : null}
    </SidebarContent>
  );
}
