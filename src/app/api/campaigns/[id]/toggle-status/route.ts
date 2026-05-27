import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const campaign = await prisma.campaign.findUnique({ where: { id: params.id } })
  if (!campaign || campaign.creatorId !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const nextStatus = campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE"

  await prisma.campaign.update({
    where: { id: params.id },
    data: { status: nextStatus },
  })

  redirect(`/dashboard/creator/campaigns/${params.id}`)
}
