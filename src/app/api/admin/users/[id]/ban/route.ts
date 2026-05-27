import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-check"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const { action } = await request.json()

  const supabase = createAdminClient()
  if (action === "ban") {
    await supabase.auth.admin.updateUserById(params.id, { ban_duration: "100000d" })
  } else {
    await supabase.auth.admin.updateUserById(params.id, { ban_duration: "0" })
  }

  return NextResponse.json({ success: true })
}
