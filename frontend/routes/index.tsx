import { AppSidebar } from "@/components/app-sidebar";
import { ChatInput } from "@/components/chat-input";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { convexQuery, useConvexAuth } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

export function HomePage() {
  const { open } = useSidebar();

  const { isAuthenticated, isLoading } = useConvexAuth();
  const t = useQuery(
    convexQuery(api.test.testQuery, isAuthenticated ? {} : "skip")
  );

  return (
    <>
      <SidebarInset className="h-screen relative">
        <div className="p-4 flex h-full w-full flex-col">
          <SidebarTrigger
            className={cn("-ml-1 rotate-180 self-end ", open && "rotate-0")}
          />
          {JSON.stringify(t.data)}
          <h1 className="mt-auto mx-auto">Hello </h1>
        </div>

        <div className="pointer-events-none z-10 absolute bottom-0 w-full px-2">
          <ChatInput />
        </div>
      </SidebarInset>
      <AppSidebar />
    </>
  );
}
