import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const campaignId = searchParams.get("campaignId")

    const where: Prisma.SubmissionWhereInput = { clipperId: user.id }
    if (status && ["PENDING", "APPROVED", "REJECTED", "PAID"].includes(status)) {
      where.status = status as "PENDING" | "APPROVED" | "REJECTED" | "PAID"
    }
    if (campaignId) where.campaignId = campaignId

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const skip = (page - 1) * limit

    const submissions = await prisma.submission.findMany({
      where,
      skip,
      take: limit,
      include: {
        campaign: {
          select: { id: true, title: true, bountyPerLakhViews: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.submission.count({ where })

    return NextResponse.json({ submissions, pagination: { page, limit, total } })
  } catch (error) {
    console.error("Get my submissions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
