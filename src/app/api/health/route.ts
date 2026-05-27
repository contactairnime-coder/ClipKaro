import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const checks: Record<string, string> = {}

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from("profiles").select("id").limit(1)
    checks.database = error ? `error: ${error.message}` : "connected"
  } catch (e: unknown) {
    checks.database = `error: ${e instanceof Error ? e.message : "unknown"}`
  }

  try {
    checks.redis = process.env.REDIS_URL ? "configured" : "not configured"
  } catch {
    checks.redis = "error"
  }

  const healthy = checks.database === "connected"

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
      env: process.env.NODE_ENV,
    },
    { status: healthy ? 200 : 503 }
  )
}
