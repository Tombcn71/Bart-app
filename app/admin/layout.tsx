"use client";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

function CustomSidebarTrigger() {
  const { toggleSidebar, openMobile, isMobile, open } = useSidebar();
  const isOpen = isMobile ? openMobile : open;
  return (
    <button
      onClick={toggleSidebar}
      className="p-2 rounded-md hover:bg-gray-100 text-slate-600">
      {isOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login" || pathname === "/login") return <>{children}</>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <CustomSidebarTrigger />
            <div>
              <h1 className="text-xl font-black text-slate-800">Dashboard</h1>
            </div>
          </div>
          <a
            href="https://offerte.budgetkozijnenshop.nl/"
            target="_blank"
            className="bg-[#2cb1e1] hover:bg-[#1fa1cf] text-white px-5 py-2.5 rounded-xl font-bold text-sm">
            Bekijk App ↗
          </a>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </SidebarProvider>
  );
}
