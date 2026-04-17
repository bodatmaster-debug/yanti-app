
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
  ClipboardList,
  Moon,
  Sun
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
    url: "/surat-masuk",
    badge: null,
  },
  {
    title: "Surat Keluar",
    icon: Send,
    url: "/surat-keluar",
    badge: null,
  },
  {
    title: "Berita Acara",
    icon: ClipboardList,
    url: "/berita-acara",
    badge: null,
  },
  {
    title: "Arsip Digital",
    icon: Archive,
    url: "/arsip-digital",
    badge: null,
  },
]

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950">
      <SidebarHeader className="h-20 flex flex-col justify-center px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <div className="flex items-center gap-3 ml-2 group-data-[collapsible=icon]:ml-0">
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all">
            <Mail className="size-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 leading-tight">Pengarsipan Yanti</span>
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
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title} 
                    isActive={pathname === item.url}
                    className="rounded-md transition-all hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="group-data-[collapsible=icon]:hidden text-[10px] font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-1.5 py-0.5 min-w-[20px]">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto mb-4">
          <SidebarGroupLabel className="text-[10px] font-semibold text-slate-400 px-2 mb-2">Konfigurasi</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 flex items-center justify-between group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="size-4 text-slate-400" /> : <Sun className="size-4 text-slate-400" />}
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Mode Gelap</span>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
              />
            </div>
            <SidebarMenu className="group-data-[collapsible=icon]:flex hidden">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Toggle Theme" 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="rounded-md hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-300 dark:border-slate-800 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-900 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                >
                  <Avatar className="h-8 w-8 rounded border border-slate-200 dark:border-slate-800 shadow-none">
                    <AvatarFallback className="rounded bg-slate-50 dark:bg-slate-900 text-[10px] font-semibold text-slate-900 dark:text-slate-100">Y</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-slate-900 dark:text-slate-100">Yanti</span>
                    <span className="truncate text-[11px] font-medium text-slate-400">yanti@pengarsipan.app</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 group-data-[collapsible=icon]:hidden text-slate-300" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-none p-1"
                side="right"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem className="gap-2 py-2 text-xs font-medium focus:bg-slate-50 dark:focus:bg-slate-900 cursor-pointer text-slate-900 dark:text-slate-100">
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
