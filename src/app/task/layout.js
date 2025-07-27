import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DM_Sans } from "next/font/google";
import NavMobile from "../components/NavMobile";
import { createClient } from "../utils/supabase/server";

const dmSans = DM_Sans({
  weight: "variable",
  subsets: ["latin"],
});

export default async function Layout({ children }) {
  const supabase = await createClient();
  const {data:{user},error} = await supabase.auth.getUser();
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <div className={` ${dmSans.className}`}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
