import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModals } from "@/stores/use-modals";
import GitHub from "../icons/github";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export function AuthModal() {
  const { open, setOpen } = useModals(
    useShallow((s) => ({
      open: s.auth,
      setOpen: s.setAuth,
    }))
  );

  const [isLoading, setIsLoading] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen} defaultOpen={false}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Login</AlertDialogTitle>
          <AlertDialogDescription>
            You need to be logged in to chat. (i dont have millions of dollars)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex !flex-col">
          <AlertDialogAction
            disabled={isLoading}
            onClick={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              authClient.signIn
                .social({
                  provider: "github",
                })
                .then(() => setIsLoading(false))
                .catch(() => setIsLoading(false));
            }}
          >
            <GitHub />
            Login with Github
          </AlertDialogAction>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
