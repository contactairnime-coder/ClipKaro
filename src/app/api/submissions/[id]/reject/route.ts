import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

async function handleReject(request: Request, params: { id: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const submission = await prisma.submission.findUnique({
    where: { id: params.id },
    include: { campaign: true },
  })

  if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 })
  if (submission.campaign.creatorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))

  await prisma.submission.update({
    where: { id: params.id },
    data: { status: "REJECTED", rejectionReason: body.reason || null },
  })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "https://clip-karo-4wbs-qsw5cb71c-airnime.vercel.app"
  return NextResponse.redirect(new URL(`/dashboard/creator/campaigns/${submission.campaignId}`, baseUrl))
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return handleReject(request, params)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  return handleReject(request, params)
}
