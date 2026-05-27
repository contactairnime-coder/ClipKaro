import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { syncSubmissionViews } from "@/lib/viewSync"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile || (profile.role !== "ADMIN" && profile.role !== "CREATOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: {
      submissions: {
        where: { status: { in: ["APPROVED", "PAID"] } },
      },
    },
  })
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 })

  if (profile.role === "CREATOR" && campaign.creatorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let syncedCount = 0
  let totalViews = 0
  let totalEarnings = 0
  const errors: string[] = []

  for (const submission of campaign.submissions) {
    try {
      const result = await syncSubmissionViews(submission.id)
      if (result.viewCount) {
        syncedCount++
        totalViews += result.viewCount
        totalEarnings += result.earningsCalculated || 0
      } else if (result.error) {
        errors.push(result.error)
      }
    } catch (err) {
      errors.push(`Submission ${submission.id}: ${err}`)
    }
  }

  return NextResponse.json({ syncedCount, totalViews, totalEarnings, errors })
}
