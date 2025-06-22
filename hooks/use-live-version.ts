import { getVersion } from "@/lib/api/version";
import { useModals } from "@/stores/use-modals";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const VERSION_REFETCH_INTERVAL = 1000 * 60;

export function useLiveVersion() {
  const currentVersion = useRef<string | null>(null);
  const isOpen = useModals((s) => s.newVersion);

  const { data, isFetching } = useQuery({
    queryKey: ["version"],
    queryFn: getVersion,
    refetchInterval: VERSION_REFETCH_INTERVAL,
    enabled: !isOpen,
  });

  useEffect(() => {
    if (!data || isFetching) return;

    if (currentVersion.current === null) {
      currentVersion.current = data;
      return;
    }

    if (currentVersion.current !== data) {
      // Show alert to refresh
      console.log("is same");
      useModals.getState().setNewVersionModal(true);
      return;
    }
  }, [data, isFetching]);
}
