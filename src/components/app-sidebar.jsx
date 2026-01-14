"use client";

import * as React from "react";
import { Calendar, Mail } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Task",
      url: "/task",
      icon: Calendar,
    },
    {
      title: "Contact",
      url: "mailto:herbart.dev@gmail.com",
      icon: Mail,
    },
  ],
};

export function AppSidebar({ user, ...props}) {
  const { open, openMobile, isOpen, isMobile } = useSidebar();
  const pathName = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/task"} className="group cursor-pointer">
              <SidebarMenuButton aria-label="Task Page" className={`cursor-pointer gap-0`}>
                <img
                aria-hidden="true"
                  className={`h-full transition-transform group-hover:rotate-12 ${isMobile ? "hidden" : ""}`}
                  src={"/essence_badge.svg"}
                ></img>
                {open && (
                  <img aria-hidden className={`h-full ${isMobile?' hidden ':''} `} src={"/essence_half.svg"}></img>
                )}
                {isMobile && 
                  <img aria-hidden className={`h-full `} src={"/essence_logo.svg"}></img>
                
                }
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain path={pathName} items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
