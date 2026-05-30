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
      className="absolute -right-10 top-4 z-50 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white md:hidden">
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
    <Sidebar
      className="border-none"
      style={
        {
          background: "linear-gradient(to bottom, #1066a3, #2cb1e1)",
          "--sidebar-foreground": "#ffffff",
          "--sidebar-accent": "rgba(0,0,0,0.1)",
          "--sidebar-accent-foreground": "#ffffff",
        } as React.CSSProperties
      }>
      <SidebarHeader className="relative bg-white h-24 flex items-center justify-center p-6 border-b border-gray-100">
        <img
          src="/bartmooi-logo-1.png"
          alt="BartMooi Logo"
          className="max-h-[50px] w-auto object-contain"
        />
        <CustomSidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarMenu className="gap-2 font-semibold text-sm text-white">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-black/20 text-white">
                <a href="/admin">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible defaultOpen className="group/offertes">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="hover:bg-black/20 text-white w-full flex justify-between">
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
                  <SidebarMenuSub className="border-l border-white/20 ml-6 mt-1 space-y-1">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className="text-white hover:bg-black/10">
                        <a href="/admin/offertes">Verstuurd</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className="text-white hover:bg-black/10">
                        <a href="/admin/offertes/geaccepteerd">Geaccepteerd</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="hover:bg-black/20 text-white w-full flex justify-between">
                    <div className="flex items-center gap-3">
                      <Package size={20} />
                      <span>Producten</span>
                    </div>
                    <ChevronRight
                      className="transition-transform group-data-[state=open]/collapsible:rotate-90"
                      size={16}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="border-l border-white/20 ml-6 mt-1 space-y-1">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className="text-white hover:bg-black/10">
                        <a href="/admin/kozijnenprijzen">Kozijnen Prijzen</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className="text-white hover:bg-black/10">
                        <a href="/admin/deurenprijzen">Deuren Prijzen</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className="text-white hover:bg-black/10">
                        <a href="/admin/schuifpuiprijzen">Schuifpui Prijzen</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className="text-white hover:bg-black/10">
                        <a href="/admin/harmonicadeuurprijzen">Harmonicadeur Prijzen</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className="text-white hover:bg-black/10">
                        <a href="/admin/rolluikenprijzen">Rolluiken Prijzen</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className="text-white hover:bg-black/10">
                        <a href="/admin/horrenprijzen">Horren Prijzen</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10 bg-black/10 text-white">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
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
            className="p-2 rounded-lg hover:bg-black/20 transition-colors opacity-70 hover:opacity-100">
            <LogOut size={16} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
