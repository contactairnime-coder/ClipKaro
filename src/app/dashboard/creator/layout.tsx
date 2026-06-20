import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Megaphone,
  List,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"

const sidebarLinks = [
  { href: "/dashboard/creator", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/creator/campaigns/create", label: "Create Campaign", icon: Megaphone },
  { href: "/dashboard/creator/campaigns", label: "My Campaigns", icon: List },
  { href: "/dashboard/creator/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/creator/add-funds", label: "Add Funds", icon: Wallet },
  { href: "/dashboard/creator/settings", label: "Settings", icon: Settings },
]

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile || profile.role !== "CREATOR") redirect("/dashboard")

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/dashboard/creator" className="flex items-center gap-2 text-lg font-bold">
            <Image src="/logo.png" alt="Clipr" width={24} height={24} className="w-6 h-6" />
            Clipr
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" className="w-full justify-start gap-3" type="submit">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b px-6">
          <div className="flex flex-1 items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/creator" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{profile.name || "Creator"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{profile.name}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {profile.name?.charAt(0) || "C"}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
