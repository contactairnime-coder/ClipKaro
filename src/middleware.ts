import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

const publicPaths = ["/api/health", "/api/stats", "/api/campaigns", "/_next"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p))
  const isStatic = pathname.includes(".") || pathname.startsWith("/_next")
  const isWebhook = pathname.startsWith("/api/webhooks")

  if (isStatic || isPublic || isWebhook) {
    return await updateSession(request)
  }

  const ratelimit = await createRatelimit()
  if (ratelimit) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "anonymous"

    const { success, limit, remaining, reset } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      )
    }
  }

  return await updateSession(request)
}

async function createRatelimit() {
  try {
    const { Ratelimit } = await import("@upstash/ratelimit")
    const { Redis } = await import("@upstash/redis")

    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (url && token) {
      const redis = new Redis({ url, token })
      return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "10 s"),
        analytics: true,
        prefix: "ratelimit",
      })
    }

    const redisUrl = process.env.REDIS_URL
    if (redisUrl) {
      const parsed = new URL(redisUrl)
      const restUrl = `${parsed.protocol === "rediss:" ? "https" : "http"}://${parsed.hostname}`
      const restToken = parsed.password ? decodeURIComponent(parsed.password) : ""
      const redis = new Redis({ url: restUrl, token: restToken })
      return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "10 s"),
        analytics: true,
        prefix: "ratelimit",
      })
    }

    return null
  } catch {
    return null
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
