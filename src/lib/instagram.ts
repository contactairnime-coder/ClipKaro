const TIMEOUT_MS = 10_000

export function extractInstagramId(url: string): string | null {
  const patterns = [
    /(?:instagram\.com\/reels?\/)([a-zA-Z0-9_-]+)/,
    /(?:instagram\.com\/p\/)([a-zA-Z0-9_-]+)/,
    /(?:instagram\.com\/reel\/)([a-zA-Z0-9_-]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export async function getInstagramStats(reelUrl: string) {
  const mediaId = extractInstagramId(reelUrl)
  if (!mediaId) {
    return { error: "Invalid Instagram URL", viewCount: 0, likeCount: 0, commentCount: 0 }
  }

  const appId = process.env.INSTAGRAM_APP_ID
  const appSecret = process.env.INSTAGRAM_APP_SECRET

  if (!appId || !appSecret) {
    return { error: "Instagram API not configured", viewCount: 0, likeCount: 0, commentCount: 0 }
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const oEmbedRes = await fetch(
      `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(reelUrl)}&access_token=${appId}|${appSecret}`,
      { signal: controller.signal }
    )
    clearTimeout(timer)

    const oEmbedData = await oEmbedRes.json()

    if (oEmbedData.error) {
      return { error: "Instagram API error: " + (oEmbedData.error.message || "Unknown"), viewCount: 0, likeCount: 0, commentCount: 0 }
    }

    return {
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      thumbnailUrl: oEmbedData.thumbnail_url || null,
      authorName: oEmbedData.author_name || null,
    }
  } catch (err) {
    const message = err instanceof Error && err.name === "AbortError" ? "Instagram API timeout" : "Instagram API request failed"
    console.error("Instagram API error:", err)
    return { error: message, viewCount: 0, likeCount: 0, commentCount: 0 }
  }
}
