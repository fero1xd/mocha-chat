import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Coffee } from "lucide-react";
import { Link } from "react-router";
import { AuthState } from "./sidebar-auth-state";
import { Threads } from "./threads";
import { ThreadsSearch } from "./threads-search";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

export function AppSidebar() {
  return (
    <Sidebar side="right">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/" className="p-2 flex items-center justify-center gap-2">
              <Coffee />
              <h1 className="text-xl">Mocha Chat</h1>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroup>
          <SidebarGroupContent>
            <Button className="w-full" asChild>
              <Link to="/">New Thread</Link>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <form>
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>

              <ThreadsSearch />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
        <Separator className="mt-2" />
      </SidebarHeader>

      <Threads />
      <SidebarFooter>
        <AuthState />
      </SidebarFooter>
    </Sidebar>
  );
}
