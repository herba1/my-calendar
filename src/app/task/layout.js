import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DM_Sans } from "next/font/google";
import NavMobile from "../components/NavMobile";

const dmSans = DM_Sans({
  weight: "variable",
  subsets: ["latin"],
});

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className={` ${dmSans.className}`}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
