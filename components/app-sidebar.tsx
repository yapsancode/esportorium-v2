"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
      isActive: true,
    },
    {
      title: "Tournaments",
      url: "/tournaments",
      icon: Trophy,
    },
    {
      title: "Participants",
      url: "/participants",
      icon: Users,
    },
    {
      title: "Brackets",
      url: "/brackets",
      icon: GitGraph,
    },
    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: Medal,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} onLogout={handleLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
