"use client"
import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Trophy,
  Users,
  GitGraph,
  Medal,
  User,
  LogOut,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { createBrowserClient } from "@/lib/supabase"

// Esportorium navigation data
const data = {
  user: {
    name: "User",
    email: "user@esportorium.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "ESPORTORIUM",
      logo: Trophy,
      plan: "Platform",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Tournaments",
      url: "/tournaments",
      icon: Trophy,
      items: [
        {
          title: "All Tournaments",
          url: "/tournaments",
        },
        {
          title: "Create New",
          url: "/tournaments/create",
        },
        {
          title: "Participants",
          url: "/tournaments/participants",
        },
        {
          title: "Brackets",
          url: "/tournaments/brackets",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()

  const navMainWithActive = data.navMain.map((item) => ({
    ...item,
    isActive: pathname === item.url || pathname?.startsWith(`${item.url}/`),
  }))

  const handleLogout = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={data.user}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}