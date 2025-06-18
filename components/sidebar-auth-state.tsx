import { useUser } from "@/hooks/use-jwt";
import { authClient } from "@/lib/auth/client";
import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import posthog from "posthog-js";

export function AuthState() {
  const [loading, setLoading] = useState(false);
  const { user, isRealLoading } = useUser();

  // need to refactor this mess

  if (!user && isRealLoading) {
    return (
      <Button
        className="flex gap-3 items-center justify-start w-full py-6"
        variant="ghost"
      >
        <Skeleton className="rounded-full w-8 h-8" />

        <div className="flex flex-col min-w-0 text-foreground">
          <Skeleton className="h-3 w-32 mb-1" />
          <Skeleton className="h-2 w-10" />
        </div>
      </Button>
    );
  }

  if (!user && !isRealLoading) {
    return (
      <SidebarMenu>
        <Separator />
        <SidebarMenuItem>
          <Button
            className="flex gap-3 items-center justify-start w-full py-6"
            variant="ghost"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              posthog.capture("Login");
              await authClient.signIn.social({
                provider: "github",
              });
            }}
          >
            {loading ? (
              <Loader2 width={24} height={24} className="animate-spin" />
            ) : (
              <LogIn width={24} height={24} />
            )}
            <span>Login with Github</span>
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <Separator />
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="py-8" asChild>
              {user ? (
                <Button
                  className="flex gap-3 items-center justify-start w-full"
                  variant="ghost"
                >
                  <Image
                    src={user.image!}
                    alt=""
                    className="rounded-full w-8 h-8"
                    width={100}
                    height={100}
                    priority
                  />

                  <div className="flex flex-col min-w-0 text-foreground">
                    <span className="truncate font-medium text-sm">
                      {user.name}
                    </span>
                    <span className="text-xs">Free</span>
                  </div>
                </Button>
              ) : null}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                localStorage.removeItem("threads");
                localStorage.removeItem("jwt");
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.pathname = "/";
                    },
                  },
                });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
