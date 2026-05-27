import { NextResponse } from "next/server"
import { startQueues } from "@/lib/queue/init"

let started = false

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  if (started) {
    return NextResponse.json({ message: "Queues already running", started: true })
  }

  try {
    startQueues()
    started = true
    return NextResponse.json({ message: "Queues started", started: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start queues"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
