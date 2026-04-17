"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  Inbox, 
  Send, 
  Archive, 
  Settings, 
  Mail,
  ChevronRight,
  LogOut,
  User
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuBadge,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  {
    title: "Dashboard Utama",
    icon: LayoutDashboard,
    url: "/",
    badge: null,
  },
  {
    title: "Surat Masuk",
    icon: Inbox,
    url: "#",
    badge: "12",
  },
  {
    title: "Surat Keluar",
    icon: Send,
    url: "#",
    badge: null,
  },
  {
    title: "Arsip Digital",
    icon: Archive,
    url: "#",
    badge: null,
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-300 bg-white">
      <SidebarHeader className="h-20 flex flex-col justify-center px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded border border-slate-300 bg-white text-slate-900 transition-all">
            <Mail className="size-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm tracking-tight text-slate-900 leading-tight">Pengarsipan Yanti</span>
            <span className="text-[10px] font-medium text-slate-400 tracking-tight leading-tight">App untuk Yanti untuk mengarsip surat</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold text-slate-400 px-2 mb-2">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="rounded-md transition-all hover:bg-slate-50 text-slate-900 text-sm">
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4 text-slate-900" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="group-data-[collapsible=icon]:hidden text-[10px] font-semibold border border-slate-200 bg-white text-slate-900 px-1.5 py-0.5 min-w-[20px]">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[10px] font-semibold text-slate-400 px-2 mb-2">Konfigurasi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Pengaturan" className="rounded-md hover:bg-slate-50 text-slate-900 text-sm">
                  <Settings className="size-4 text-slate-900" />
                  <span className="font-medium">Pengaturan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-300 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-slate-50 rounded-md border border-transparent hover:border-slate-200"
                >
                  <Avatar className="h-8 w-8 rounded border border-slate-200 shadow-none">
                    <AvatarFallback className="rounded bg-slate-50 text-[10px] font-semibold text-slate-900">Y</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-slate-900">Yanti</span>
                    <span className="truncate text-[11px] font-medium text-slate-400">yanti@pengarsipan.app</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 group-data-[collapsible=icon]:hidden text-slate-300" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md border border-slate-300 bg-white shadow-none p-1"
                side="right"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem className="gap-2 py-2 text-xs font-medium focus:bg-slate-50 cursor-pointer text-slate-900">
                  <User className="size-4 text-slate-400" /> Profil Saya
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 py-2 text-destructive font-semibold text-xs focus:bg-destructive/5 cursor-pointer">
                  <LogOut className="size-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}