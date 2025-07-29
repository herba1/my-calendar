"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogIn,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import SettingDialog from "./ui/settingDialog";
import { DialogTrigger } from "./ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { logout } from "@/app/login/actions";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  if (user?.is_anonymous) {
    user = null;
  }

  return (
    <SettingDialog user={user}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="flex h-8 w-8 items-center justify-center rounded-lg">
                  {user ? (
                    <>
                      <AvatarImage
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata.name}
                      />
                      {user.user_metadata.name ? (
                        <AvatarFallback className="rounded-lg">
                          {user.user_metadata.name[0]}
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="rounded-lg">
                          {user.user_metadata.email[0]}
                        </AvatarFallback>
                      )}
                    </>
                  ) : (
                    <User stroke="black" />
                  )}
                </Avatar>
                {user ? (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.user_metadata.name}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                ) : (
                  <span className="truncate font-medium">Login</span>
                )}

                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              {user ? (
                <>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user.user_metadata.avatar_url}
                          alt={user.user_metadata.name}
                        />
                        {user.user_metadata.name ? (
                          <AvatarFallback className="rounded-lg">
                            {user.user_metadata.name[0]}
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="rounded-lg">
                            {user.user_metadata.email[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user.user_metadata.name
                            ? user.user_metadata.name
                            : user.user_metadata.email.slice(
                                0,
                                user.user_metadata.email.indexOf("@"),
                              )}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DialogTrigger className={`w-full`}>
                      <DropdownMenuItem>
                        <BadgeCheck />
                        Account Settings
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <form className="w-full">
                      <Button
                        className={`flex w-full justify-start gap-1 !no-underline`}
                        formAction={logout}
                        variant={"link"}
                      >
                        <LogOut />
                        Log out
                      </Button>
                    </form>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className={`relative`}>
                  <Link
                    href={"/login"}
                    className={`absolute top-0 right-0 left-0 z-10 h-full w-full`}
                  ></Link>
                  <LogIn />
                  Login or Sign Up
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SettingDialog>
  );
}
