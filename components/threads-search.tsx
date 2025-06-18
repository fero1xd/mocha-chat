import { Search } from "lucide-react";
import { SidebarInput } from "./ui/sidebar";
import { useThreadsSearch } from "@/stores/use-thread-search";

export function ThreadsSearch() {
  const setSearch = useThreadsSearch((s) => s.setSearch);
  return (
    <>
      <SidebarInput
        id="search"
        placeholder="Search your threads..."
        onChange={(e) => setSearch(e.target.value)}
        className="pl-8"
      />
      <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
    </>
  );
}
