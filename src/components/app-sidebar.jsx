"use client";

import * as React from "react";
import { Calendar, Mail } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
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
import { useAuth } from "@/app/context/AuthContext";
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
      url: "/home",
      icon: Calendar,
    },
    {
      title: "Contact",
      url: "/",
      icon: Mail,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { open, openMobile, isOpen, isMobile } = useSidebar();
  console.log(open);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"#"} className="group cursor-pointer">
              <SidebarMenuButton className={`cursor-pointer gap-0`}>
                <img
                  className={`h-full transition-transform group-hover:rotate-12 ${isMobile ? "hidden" : ""}`}
                  src={"/essence_badge.svg"}
                ></img>
                {open && (
                  <img className={`h-full ${isMobile?' hidden ':''} `} src={"/essence_half.svg"}></img>
                )}
                {isMobile && 
                  <img className={`h-full `} src={"/essence_logo.svg"}></img>
                
                }
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
