import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const { action } = await request.json()

  const supabase = createAdminClient()
  if (action === "ban") {
    await supabase.auth.admin.updateUserById(params.id, { ban_duration: "100000d" })
    await prisma.profile.update({ where: { id: params.id }, data: { isVerified: false } })
  } else {
    await supabase.auth.admin.updateUserById(params.id, { ban_duration: "0" })
    await prisma.profile.update({ where: { id: params.id }, data: { isVerified: true } })
  }

  return NextResponse.json({ success: true })
}
