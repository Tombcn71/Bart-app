"use client";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { FeedbackButton } from "../components/FeedbackButton";
import { AdminTheme } from "../components/AdminTheme";

function CustomSidebarTrigger() {
  const { toggleSidebar, openMobile, isMobile, open } = useSidebar();
  const isOpen = isMobile ? openMobile : open;
  return (
    <button
      onClick={toggleSidebar}
      className="p-2 rounded-md hover:bg-muted text-muted-foreground">
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

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <header className="h-20 bg-card border-b border-border px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <CustomSidebarTrigger />
            <div>
              <h1 className="text-xl font-black text-foreground">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
          <AdminTheme />
          <a
            href={`${SITE_URL}/`}
            target="_blank"
            className="bg-[#2cb1e1] hover:bg-[#1fa1cf] text-white px-5 py-2.5 rounded-xl font-bold text-sm">
            Bekijk App ↗
          </a>
          </div>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
      <Toaster position="top-right" richColors />
      <FeedbackButton />
    </SidebarProvider>
  );
}
