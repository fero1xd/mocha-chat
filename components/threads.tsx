import { useThreads } from "@/hooks/use-threads";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Link } from "react-router";
import { Trash } from "lucide-react";

export function Threads() {
  const threads = useThreads();

  return (
    <SidebarMenu>
      {threads.map(({ id, title }) => (
        <SidebarMenuItem key={id}>
          <SidebarMenuButton asChild>
            <Link to={`/${id}`}>
              <span>{title}</span>
            </Link>
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
  );
}
