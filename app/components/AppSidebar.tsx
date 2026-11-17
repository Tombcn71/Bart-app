"use client";
import * as React from "react";
import {
  LayoutDashboard,
  FileText,
  Package,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Ruler,
  Link2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { adminLogout } from "@/app/actions";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

export function AppSidebar() {
  const router = useRouter();

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
          <SidebarMenu className="gap-2 font-semibold text-sm text-sidebar-foreground">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <a href="/admin">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible defaultOpen className="group/offertes">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full flex justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={20} />
                      <span>Offertes</span>
                    </div>
                    <ChevronRight
                      className="transition-transform group-data-[state=open]/offertes:rotate-90"
                      size={16}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="border-l border-sidebar-border ml-6 mt-1 space-y-1">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <a href="/admin/offertes">Verstuurd</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <a href="/admin/offertes/geaccepteerd">Geaccepteerd</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Zoals bij kozijnsoftware: Inmeten en Link versturen staan in het menu (ook in de web app op de telefoon) */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <a href="/meten/inmeten">
                  <Ruler size={20} />
                  <span>Inmeten</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <a href="/meten/reageer">
                  <Link2 size={20} />
                  <span>Link versturen</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <a href="/admin/kozijnenprijzen">
                  <Package size={20} />
                  <span>Prijzen</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
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
