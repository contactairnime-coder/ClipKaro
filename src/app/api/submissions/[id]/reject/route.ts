import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

async function handleReject(request: Request, params: { id: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const submission = await prisma.submission.findUnique({
    where: { id: params.id },
    include: { campaign: true },
  })

  if (!submission) return Response.json({ error: "Submission not found" }, { status: 404 })
  if (submission.campaign.creatorId !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))

  await prisma.submission.update({
    where: { id: params.id },
    data: { status: "REJECTED", rejectionReason: body.reason || null },
  })

  redirect(`/dashboard/creator/campaigns/${submission.campaignId}`)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return handleReject(request, params)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  return handleReject(request, params)
}
