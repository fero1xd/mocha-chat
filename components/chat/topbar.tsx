import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

export function Topbar() {
  const { open } = useSidebar();
  return (
    <div className="absolute py-2 inset-x-0 top-0 z-10  box-content overflow-hidden border-b border-chat-border bg-gradient-noise-top/80 backdrop-blur-md transition-[transform,border] ease-snappy blur-fallback:bg-gradient-noise-top  sm:h-3.5 flex items-center justify-end">
      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
      <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-noise-top blur-fallback:hidden"></div>

      <SidebarTrigger className={cn(" z-10 rotate-180", open && "rotate-0")} />
    </div>
  );
}
