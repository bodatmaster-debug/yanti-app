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
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border bg-white">
      <SidebarHeader className="h-16 border-b border-border flex flex-row items-center px-4 gap-3 bg-white">
        <div className="flex aspect-square size-8 items-center justify-center rounded bg-primary text-primary-foreground">
          <Mail className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
          <span className="font-bold text-sm tracking-tight">Surat Digital</span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wide">Arsip Modern</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold tracking-wide group-data-[collapsible=icon]:hidden">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="rounded hover:bg-muted/50">
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="group-data-[collapsible=icon]:hidden font-mono bg-muted border border-border shadow-none">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[11px] font-bold tracking-wide group-data-[collapsible=icon]:hidden">Lainnya</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="rounded hover:bg-muted/50">
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-muted rounded"
                >
                  <Avatar className="h-8 w-8 rounded border border-border">
                    <AvatarFallback className="rounded bg-muted text-xs font-bold">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-bold">Admin</span>
                    <span className="truncate text-[10px] text-muted-foreground tracking-tight">admin@surat.digital</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded border border-border shadow-none"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2 font-medium">
                  <User className="size-4" /> Profil Saya
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-destructive font-medium">
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