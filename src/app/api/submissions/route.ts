import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const profile = await prisma.profile.findUnique({ where: { id: user.id } })
    if (!profile || profile.role !== "CLIPPER") {
      return NextResponse.json({ error: "Only clippers can submit clips" }, { status: 403 })
    }

    const body = await request.json()
    const { campaignId, submittedUrl, platform } = body

    if (!campaignId || !submittedUrl || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } })
    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    if (campaign.status !== "ACTIVE") return NextResponse.json({ error: "Campaign is not active" }, { status: 400 })
    if (campaign.remainingBounty <= 0) return NextResponse.json({ error: "Campaign bounty exhausted" }, { status: 400 })

    if (!campaign.allowedPlatforms.includes(platform)) {
      return NextResponse.json({ error: "Platform not allowed for this campaign" }, { status: 400 })
    }

    const existing = await prisma.submission.findFirst({
      where: { submittedUrl, clipperId: user.id },
    })
    if (existing) return NextResponse.json({ error: "You already submitted this URL" }, { status: 409 })

    const submission = await prisma.submission.create({
      data: {
        campaignId,
        clipperId: user.id,
        submittedUrl,
        platform,
        status: "PENDING",
      },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error("Create submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
