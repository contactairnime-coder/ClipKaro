"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type User = {
  id: string
  name: string | null
  email: string
  role: string
  totalEarned: number
  isVerified: boolean
  createdAt: string
  _count: { submissions: number; campaigns: number }
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  async function toggleBan(userId: string, ban: boolean) {
    const res = await fetch(`/api/admin/users/${userId}/ban`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: ban ? "ban" : "unban" }),
    })
    if (res.ok) toast.success(ban ? "User banned" : "User unbanned")
  }

  const filtered = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  if (loading) return <div className="h-64 animate-pulse rounded bg-muted" />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="mt-2 max-w-sm" />
      </div>

      <Tabs defaultValue="clippers">
        <TabsList>
          <TabsTrigger value="clippers">Clippers</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>

        {["CLIPPER", "CREATOR", "ADMIN"].map((role) => (
          <TabsContent key={role} value={role.toLowerCase() + "s"} className="mt-4">
            {filtered.filter((u) => u.role === role).length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No users found</CardContent></Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Joined</th>
                      <th className="pb-3 font-medium">{role === "CREATOR" ? "Spent" : "Earned"}</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.filter((u) => u.role === role).map((u) => (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{u.name || "—"}</td>
                        <td className="py-3">{u.email}</td>
                        <td className="py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">₹{u.totalEarned.toLocaleString()}</td>
                        <td className="py-3">
                          <Badge variant={u.isVerified ? "default" : "secondary"}>{u.isVerified ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="destructive" onClick={() => toggleBan(u.id, true)}>Ban</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
