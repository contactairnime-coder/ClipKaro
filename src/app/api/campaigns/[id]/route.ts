import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
            creatorProfile: {
              select: { channelName: true, instagramHandle: true, followerCount: true },
            },
          },
        },
        submissions: {
          include: {
            clipper: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    })

    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Get campaign error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { status } = body

    const campaign = await prisma.campaign.findUnique({ where: { id: params.id } })
    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    if (campaign.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await prisma.campaign.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update campaign error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
