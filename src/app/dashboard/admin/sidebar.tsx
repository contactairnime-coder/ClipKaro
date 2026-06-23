"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  CheckCircle,
  AlertTriangle,
  Banknote,
  Users,
  ArrowLeftRight,
  Activity,
  LogOut,
} from "lucide-react"

const sidebarLinks = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/campaigns", label: "Campaign Approvals", icon: CheckCircle },
  { href: "/dashboard/admin/fraud", label: "Fraud Queue", icon: AlertTriangle },
  { href: "/dashboard/admin/payouts", label: "Payout Management", icon: Banknote },
  { href: "/dashboard/admin/users", label: "User Management", icon: Users },
  { href: "/dashboard/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/dashboard/admin/queue", label: "Queue Monitor", icon: Activity },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/dashboard/admin" className="flex items-center gap-2 text-lg font-bold">
          <Image src="/logo.png" alt="Clipr" width={24} height={24} className="w-6 h-6" />
          Clipr Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
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
  )
}
