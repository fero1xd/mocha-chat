import { useModals } from "@/stores/use-modals";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useShallow } from "zustand/react/shallow";

export function NewVersionModal() {
  const { open, setOpen } = useModals(
    useShallow((s) => ({
      open: s.newVersion,
      setOpen: s.setNewVersionModal,
    }))
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>A new version just dropped</AlertDialogTitle>
          <AlertDialogDescription>
            To access the latest version of Mocha Chat you need to refresh your
            browser.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
          >
            Refresh
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
