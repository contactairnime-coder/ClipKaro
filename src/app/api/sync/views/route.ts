import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { syncSubmissionViews } from "@/lib/viewSync"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=role`, {
    headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY! },
  }).then((r) => r.json())

  const isAdmin = Array.isArray(profile) && profile[0]?.role === "ADMIN"

  const { submissionId } = await request.json()
  if (!submissionId) {
    return NextResponse.json({ error: "submissionId is required" }, { status: 400 })
  }

  if (!isAdmin) {
    return NextResponse.json({ error: "Only admins can trigger sync" }, { status: 403 })
  }

  const result = await syncSubmissionViews(submissionId)
  return NextResponse.json(result)
}
