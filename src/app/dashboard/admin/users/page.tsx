"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [banConfirmId, setBanConfirmId] = useState<string | null>(null)
  const [banning, setBanning] = useState<string | null>(null)
  const [bannedIds, setBannedIds] = useState<Set<string>>(new Set())

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users")
    if (res.ok) setUsers(await res.json())
  }, [])

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false))
  }, [fetchUsers])

  async function toggleBan(userId: string, currentlyBanned: boolean) {
    setBanning(userId)
    const res = await fetch(`/api/admin/users/${userId}/ban`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: currentlyBanned ? "unban" : "ban" }),
    })
    setBanning(null)
    setBanConfirmId(null)
    if (res.ok) {
      toast.success(currentlyBanned ? "User unbanned" : "User banned")
      const newBanned = new Set(bannedIds)
      if (currentlyBanned) newBanned.delete(userId)
      else newBanned.add(userId)
      setBannedIds(newBanned)
      fetchUsers()
    } else {
      toast.error("Failed to update user")
    }
  }

  const filtered = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  if (loading) return <div className="h-64 animate-pulse rounded bg-muted" />

  const roleTabs = [
    { key: "CLIPPER", label: "Clippers", plural: "clippers" },
    { key: "CREATOR", label: "Creators", plural: "creators" },
    { key: "ADMIN", label: "Admins", plural: "admins" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="mt-2 max-w-sm" />
      </div>

      <Tabs defaultValue="clippers">
        <TabsList>
          {roleTabs.map((t) => (
            <TabsTrigger key={t.plural} value={t.plural}>{t.label}</TabsTrigger>
          ))}
        </TabsList>

        {roleTabs.map(({ key: role, plural }) => (
          <TabsContent key={plural} value={plural} className="mt-4">
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
                    {filtered.filter((u) => u.role === role).map((u, index) => {
                      const isBanned = bannedIds.has(u.id)
                      return (
                        <motion.tr key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }} className="border-b last:border-0">
                          <td className="py-3 font-medium">{u.name || "—"}</td>
                          <td className="py-3">{u.email}</td>
                          <td className="py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="py-3">₹{u.totalEarned.toLocaleString()}</td>
                          <td className="py-3">
                            <Badge variant={isBanned ? "destructive" : u.isVerified ? "default" : "secondary"}>
                              {isBanned ? "Banned" : u.isVerified ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => setSelectedUser(u)}>View</Button>
                              {banConfirmId === u.id ? (
                                <div className="flex gap-1">
                                  <Button size="sm" variant="destructive" onClick={() => toggleBan(u.id, isBanned)} disabled={banning === u.id}>
                                    {banning === u.id ? "..." : "Confirm"}
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setBanConfirmId(null)}>Cancel</Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant={isBanned ? "outline" : "destructive"}
                                  onClick={() => setBanConfirmId(u.id)}
                                >
                                  {isBanned ? "Unban" : "Ban"}
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!selectedUser} onOpenChange={(o) => { if (!o) setSelectedUser(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{selectedUser.name || "—"}</span>
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{selectedUser.email}</span>
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium">{selectedUser.role}</span>
                <span className="text-muted-foreground">Joined</span>
                <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                <span className="text-muted-foreground">Total {selectedUser.role === "CREATOR" ? "Spent" : "Earned"}</span>
                <span className="font-medium">₹{selectedUser.totalEarned.toLocaleString()}</span>
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">{selectedUser.isVerified ? "Active" : "Inactive"}</span>
                <span className="text-muted-foreground">Submissions</span>
                <span className="font-medium">{selectedUser._count.submissions}</span>
                <span className="text-muted-foreground">Campaigns</span>
                <span className="font-medium">{selectedUser._count.campaigns}</span>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSelectedUser(null)}>Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
