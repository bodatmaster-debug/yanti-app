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
  User,
  Plus
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

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border">
      {/* Sidebar Header: Branding */}
      <SidebarHeader className="h-16 border-b border-border flex flex-row items-center px-4 gap-3">
        <div className="flex aspect-square size-8 items-center justify-center rounded border border-border bg-white text-primary">
          <Mail className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
          <span className="font-bold text-sm tracking-tight">Surat Digital</span>
          <span className="text-[10px] font-medium text-muted-foreground">Arsip Modern</span>
        </div>
      </SidebarHeader>

      {/* Sidebar Content: Navigation Groups */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-2">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="rounded-md transition-all">
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="group-data-[collapsible=icon]:hidden text-[10px] font-bold border border-border bg-muted/50">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-2">Lainnya</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Pengaturan" className="rounded-md">
                  <Settings className="size-4" />
                  <span className="font-medium">Pengaturan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer: User Profile */}
      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-muted rounded-md border border-transparent hover:border-border"
                >
                  <Avatar className="h-8 w-8 rounded border border-border">
                    <AvatarFallback className="rounded bg-muted text-[10px] font-bold">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-bold">Administrator</span>
                    <span className="truncate text-[10px] text-muted-foreground">admin@surat.digital</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 group-data-[collapsible=icon]:hidden opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md border border-border"
                side="right"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem className="gap-2 py-2 font-medium">
                  <User className="size-4" /> Profil Saya
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 py-2 text-destructive font-medium">
                  <LogOut className="size-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      {/* Sidebar Rail: Desktop Resizing / Toggle handle */}
      <SidebarRail />
    </Sidebar>
  )
}