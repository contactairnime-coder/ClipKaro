export function extractTikTokId(url: string): string | null {
  const patterns = [
    /(?:tiktok\.com\/@[\w.]+\/video\/)(\d+)/,
    /(?:vm\.tiktok\.com\/)([a-zA-Z0-9]+)/,
    /(?:tiktok\.com\/v\/)(\d+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export async function getTikTokStats(videoUrl: string) {
  try {
    const oEmbedRes = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`
    )
    if (!oEmbedRes.ok) {
      return { error: "TikTok API request failed", viewCount: 0, likeCount: 0, commentCount: 0 }
    }
    const data = await oEmbedRes.json()

    return {
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      thumbnailUrl: data.thumbnail_url || null,
      authorName: data.author_name || null,
      title: data.title || null,
    }
  } catch (err) {
    console.error("TikTok API error:", err)
    return { error: "TikTok API request failed", viewCount: 0, likeCount: 0, commentCount: 0 }
  }
}
