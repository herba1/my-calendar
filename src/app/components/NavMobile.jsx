import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { LayoutList } from "lucide-react";
import Layout from "../home/layout";

export default function NavMobile({className}) {
  return (
    <nav className={`flex justify-between sticky top-0 left-0 right-0 p-2 bg-white/80 backdrop-blur-md z-10 ${className}`}>
      <SidebarTrigger  className={` py-2`} />
      <CalendarTrigger className={` py-2`} />
    </nav>
  );
}


function CalendarTrigger({className, props}) {
  return (
    <button type="button" className={`${className}`} {...props}  >
      <LayoutList size={24} />
    </button>
  );
}
