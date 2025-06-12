import { Link } from "react-router";
import { Separator } from "./ui/separator";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { LogIn } from "lucide-react";

const auth = false;
export function AuthState() {
  return (
    <SidebarMenu>
      <Separator />
      <SidebarMenuItem>
        <SidebarMenuButton className="py-8" asChild>
          <Link to="#" className="flex gap-3 items-center w-full">
            {auth ? (
              <>
                <img
                  src="https://t3.chat/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocII33AY1cD8fcq4do34UHPeUumqM3mxTIBHEFJWYNb1sguflGLr%3Ds384-c&w=64&q=75"
                  alt=""
                  className="rounded-full w-8 h-8"
                />

                <div className="flex flex-col min-w-0 text-foreground">
                  <span className="truncate font-medium text-sm">
                    Pranjal Butola
                  </span>
                  <span className="text-xs">Free</span>
                </div>
              </>
            ) : (
              <>
                <LogIn width={24} height={24} />
                <span>Login</span>
              </>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
