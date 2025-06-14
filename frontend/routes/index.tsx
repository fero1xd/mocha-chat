import { AppSidebar } from "@/components/app-sidebar";
import { ChatInput } from "@/components/chat-input";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function HomePage() {
  const { open } = useSidebar();

  return (
    <>
      <SidebarInset className="h-screen relative">
        <div className="p-4 pt-0 flex h-full w-full flex-col overflow-y-scroll">
          <div className="absolute py-2  inset-x-0 top-0 z-10  box-content overflow-hidden border-b border-chat-border bg-gradient-noise-top/80 backdrop-blur-md transition-[transform,border] ease-snappy blur-fallback:bg-gradient-noise-top  sm:h-3.5 flex items-center justify-end">
            <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
            <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-noise-top blur-fallback:hidden"></div>

            <SidebarTrigger
              className={cn(" z-10 rotate-180", open && "rotate-0")}
            />
          </div>

          <div className="flex-1 pt-12 max-sm:pt-14 pb-[122px] ">
            <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10">
              <div className="flex justify-end">
                <div className="inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left">
                  <p>Explain React's useEffect cleanup function</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="group relative w-full max-w-full break-words">
                  React's useEffect hook allows you to perform side effects in
                  function components. Side effects are actions that happen
                  outside of the normal data flow of the component, such as
                  fetching data, subscribing to events, or manipulating the DOM
                  directly. The useEffect hook takes two arguments: A function
                  containing the side effect code. An optional array of
                  dependencies. The side effect function runs after the
                  component renders. If the dependency array is provided, the
                  effect will only re-run if any of the values in the dependency
                  array change between renders. Why Cleanup is Needed Sometimes,
                  side effects can have unintended consequences or leak
                  resources if they are not properly managed when the component
                  unmounts or when the effect re-runs due to dependency changes.
                  This is where the cleanup function comes in. The cleanup
                  function is an optional function that you can return from the
                  function you pass to useEffect. This function will be
                  executed: Before the component unmounts. Before the effect
                  re-runs due to changes in its dependencies (if the dependency
                  array is provided). The purpose of the cleanup function is to
                  "clean up" any resources or subscriptions created by the side
                  effect, preventing memory leaks or unexpected behavior. Common
                  Use Cases for Cleanup Here are some common scenarios where you
                  would use a cleanup function: Clearing Timers: If you set up
                  timers (like setTimeout or setInterval) inside useEffect, you
                  should clear them in the cleanup function to prevent them from
                  running after the component has unmounted. javascript
                </div>
              </div>

              <div className="flex justify-end">
                <div className="inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left">
                  <p>Explain React's useEffect cleanup function</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="group relative w-full max-w-full break-words">
                  React's useEffect hook allows you to perform side effects in
                  function components. Side effects are actions that happen
                  outside of the normal data flow of the component, such as
                  fetching data, subscribing to events, or manipulating the DOM
                  directly. The useEffect hook takes two arguments: A function
                  containing the side effect code. An optional array of
                  dependencies. The side effect
                  <br /> function runs after the component renders. If the
                  dependency array is provided, the effect will only re-run if
                  any of the values in the dependency array change between
                  renders. Why Cleanup is Needed Sometimes, side effects can
                  have unintended consequences or leak resources if they are not
                  properly managed when the component unmounts or when the
                  effect re-runs due to dependency changes. This is where the
                  cleanup function comes in. The cleanup function is an optional
                  function that you can return from the function you pass to
                  useEffect. This function will be executed: Before the
                  component unmounts. Before the effect re-runs due to changes
                  in its dependencies (if the dependency array is provided). The
                  purpose of the cleanup function is to "clean up" any resources
                  or subscriptions created by the side effect, preventing memory
                  leaks or unexpected behavior. Common Use Cases for Cleanup
                  Here are some common scenarios where you would use a cleanup
                  function: Clearing Timers: If you set up timers (like
                  setTimeout or setInterval) inside useEffect, you should clear
                  them in the cleanup function to prevent them from running
                  after the component has unmounted. javascript
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none z-10 absolute bottom-0 w-full px-2">
          <ChatInput />
        </div>
      </SidebarInset>
      <AppSidebar />
    </>
  );
}
