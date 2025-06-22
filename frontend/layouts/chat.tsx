import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";

export function ChatLayout() {
  const location = useLocation();
  return (
    <>
      <SidebarInset className="h-screen flex flex-col">
        <Outlet key={location.key} />
      </SidebarInset>
      <AppSidebar />
    </>
  );
}
