"use client";
import * as React from "react";
import {
  FileText,
  Package,
  Menu,
  X,
  LogOut,
  FilePlus,
  Link2,
  Users,
  Bot,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { adminLogout } from "@/app/actions";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

function CustomSidebarTrigger() {
  const { toggleSidebar, openMobile, isMobile, open } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <button
      onClick={toggleSidebar}
      className="absolute -right-10 top-4 z-50 p-2 rounded-md bg-muted hover:bg-muted/70 text-foreground md:hidden">
      {isOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  );
}

const GROEPEN = [
  {
    label: "Werk",
    items: [
      { href: "/admin/offertes", label: "Aanvragen", icon: FileText },
      { href: "/admin/bezoekers", label: "Bezoekers", icon: Users },
      { href: "/admin/assistent", label: "AI-assistent", icon: Bot },
      { href: "/meten/inmeten", label: "Offerte maken", icon: FilePlus },
      { href: "/meten/reageer", label: "Link versturen", icon: Link2 },
    ],
  },
  { label: "Instellen", items: [{ href: "/admin/kozijnenprijzen", label: "Prijzen", icon: Package }] },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="relative bg-white dark:bg-[#0b1520] h-24 flex items-center justify-center p-6 border-b border-gray-100 dark:border-white/10">
        <img
          src="/bartmooi-logo-1.png"
          alt="BartMooi Logo"
          className="max-h-[50px] w-auto object-contain dark:brightness-0 dark:invert"
        />
        <CustomSidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          {GROEPEN.map((groep) => (
            <div key={groep.label} className="mb-4">
              <p className="px-2 pb-1 text-xs font-medium text-sidebar-foreground/60">{groep.label}</p>
              <SidebarMenu className="gap-1 font-semibold text-sm text-sidebar-foreground">
                {groep.items.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(href)}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                      <a href={href}>
                        <Icon size={20} />
                        <span>{label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border text-sidebar-foreground">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent text-sidebar-accent-foreground flex items-center justify-center font-bold">
              B
            </div>
            <div>
              <p className="font-bold leading-tight">BartMooi Beheer</p>
              <p className="opacity-80">Ingelogd als Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Uitloggen"
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors opacity-70 hover:opacity-100">
            <LogOut size={16} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
