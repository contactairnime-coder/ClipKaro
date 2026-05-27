let redisUrl: string | null | undefined = null

export function getRedisConnection() {
  if (!redisUrl) {
    redisUrl = process.env.REDIS_URL
    if (!redisUrl) {
      throw new Error("REDIS_URL is not configured in .env.local")
    }
  }

  const parsed = new URL(redisUrl)

  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
    tls: parsed.protocol === "rediss:" ? {} : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times: number) {
      if (times > 3) return null
      return Math.min(times * 200, 2000)
    },
  }
}
