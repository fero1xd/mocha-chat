import { Search } from "lucide-react";
import { SidebarInput } from "./ui/sidebar";
import { useThreadsSearch } from "@/stores/use-thread-search";
import { useDebouncedCallback } from "use-debounce";

export function ThreadsSearch() {
  const setSearch = useThreadsSearch((s) => s.setSearch);

  const debounced = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 500);

  return (
    <>
      <SidebarInput
        id="search"
        placeholder="Search your threads..."
        onChange={(e) => debounced(e.target.value)}
        className="pl-8"
      />
      <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
    </>
  );
}
