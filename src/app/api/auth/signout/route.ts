import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://clipr.vercel.app"
  return NextResponse.redirect(new URL("/login", baseUrl), { status: 303 })
}
