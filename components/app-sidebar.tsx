import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Label } from "./ui/label";
import { Coffee, Search } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { AuthState } from "./sidebar-auth-state";
import { Threads } from "./threads";
import { Link } from "react-router";

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
              <SidebarInput
                id="search"
                placeholder="Search your threads..."
                className="pl-8"
              />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
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
