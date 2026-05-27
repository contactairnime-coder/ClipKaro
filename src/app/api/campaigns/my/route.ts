import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const campaigns = await prisma.campaign.findMany({
      where: { creatorId: user.id },
      include: {
        _count: { select: { submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const result = campaigns.map((c) => ({
      ...c,
      totalSubmissions: c._count.submissions,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Get campaigns error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
