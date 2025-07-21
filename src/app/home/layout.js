import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NavMobile from "../components/NavMobile";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  weight: "variable",
  subsets: ["latin"],
});

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavMobile />
        <div className={` ${dmSans.className}`}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
