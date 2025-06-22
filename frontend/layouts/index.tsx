import { AuthModal } from "@/components/modals/auth";
import { NewVersionModal } from "@/components/modals/new-version";
import { useLiveVersion } from "@/hooks/use-live-version";
import { Outlet } from "react-router";

export function RootLayout() {
  useLiveVersion();
  return (
    <>
      <AuthModal />
      <NewVersionModal />
      <Outlet />
    </>
  );
}
