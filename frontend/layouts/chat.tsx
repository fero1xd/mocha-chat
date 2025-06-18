import { AppSidebar } from "@/components/app-sidebar";
import { AuthModal } from "@/components/modals/auth";
import { SidebarInset } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";

export function ChatLayout() {
  const location = useLocation();
  return (
    <>
      <AuthModal />
      <SidebarInset className="h-screen relative">
        <Outlet key={location.key} />
      </SidebarInset>
      <AppSidebar />
    </>
  );
}
