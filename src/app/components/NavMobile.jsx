import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Calendar, LayoutList } from "lucide-react";

export default function NavMobile({ className, altView, setAltView }) {
  return (
    <nav
      className={`sticky top-0 right-0 left-0 z-10 flex justify-between bg-white/80 p-2 backdrop-blur-md ${className}`}
    >
      <SidebarTrigger className={`py-2 touch-manipulation`} />
      <ViewTrigger
        altView={altView}
        setAltView={setAltView}
        className={`py-2`}
      />
    </nav>
  );
}

function ViewTrigger({ className, props, altView, setAltView }) {
  return (
    <button
      onClick={() => {
        setAltView(!altView);
      }}
      type="button"
      className={` touch-manipulation ${className}`}
      {...props}
    >
      {altView ? <LayoutList size={24} /> : <Calendar size={24} />}
    </button>
  );
}
