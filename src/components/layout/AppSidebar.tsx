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
    title: "Dashboard",
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

const settingsItems = [
  {
    title: "Pengaturan",
    icon: Settings,
    url: "#",
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-2">
      <SidebarHeader className="h-16 border-b-2 flex flex-row items-center px-4 gap-3">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Mail className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
          <span className="font-bold text-sm">Surat Digital</span>
          <span className="text-xs text-muted-foreground">Arsip Modern</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="group-data-[collapsible=icon]:hidden">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Lainnya</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-2 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg border-2">
                    <AvatarFallback className="rounded-lg bg-muted text-xs">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">Admin</span>
                    <span className="truncate text-xs text-muted-foreground">admin@surat.digital</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-2"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2">
                  <User className="size-4" /> Profil Saya
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-destructive">
                  <LogOut className="size-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
