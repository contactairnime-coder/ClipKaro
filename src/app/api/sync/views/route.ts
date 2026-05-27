import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { syncSubmissionViews } from "@/lib/viewSync"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

  const { submissionId } = await request.json()
  if (!submissionId) {
    return NextResponse.json({ error: "submissionId is required" }, { status: 400 })
  }

  const submission = await prisma.submission.findUnique({ where: { id: submissionId } })
  if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 })

  // Admin can sync any submission, clipper can only sync their own
  if (profile.role !== "ADMIN" && submission.clipperId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const result = await syncSubmissionViews(submissionId)
  return NextResponse.json(result)
}
