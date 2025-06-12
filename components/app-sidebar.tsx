import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Label } from "./ui/label";
import { Coffee, Search, Trash } from "lucide-react";
import { Link } from "react-router";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

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
            <Button className="w-full">New Thread</Button>
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Threads</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {[
                { title: "Rs in strawberry", url: "" },
                {
                  title: "Black Holes Reality",
                  url: "",
                },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>

                  <SidebarMenuAction
                    showOnHover
                    className="transition-opacity duration-75 ease-in-out"
                  >
                    <Trash />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
