import { Separator } from "./ui/separator";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Loader2, LogIn } from "lucide-react";
import { authClient, logout } from "@/lib/auth/client";
import { useState } from "react";
import { Button } from "./ui/button";
import { useUser } from "@/hooks/use-jwt";
import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function AuthState() {
  const [loading, setLoading] = useState(false);
  const { user, isRealLoading } = useUser();

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
                  <img
                    src={user.image!}
                    alt=""
                    className="rounded-full w-8 h-8"
                  />

                  <div className="flex flex-col min-w-0 text-foreground">
                    <span className="truncate font-medium text-sm">
                      {user.name}
                    </span>
                    <span className="text-xs">Free</span>
                  </div>
                </Button>
              ) : isRealLoading ? (
                <Button
                  className="flex gap-3 items-center justify-start w-full"
                  variant="ghost"
                >
                  <Skeleton className="rounded-full w-8 h-8" />

                  <div className="flex flex-col min-w-0 text-foreground">
                    <Skeleton className="h-3 w-32 mb-1" />
                    <Skeleton className="h-2 w-10" />
                  </div>
                </Button>
              ) : (
                <Button
                  className="flex gap-3 items-center justify-start w-full"
                  variant="ghost"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
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
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                authClient.signIn.social({
                  provider: "github",
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
