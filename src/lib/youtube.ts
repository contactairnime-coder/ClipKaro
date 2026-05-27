import { google } from "googleapis"

const youtube = google.youtube("v3")

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export async function getYouTubeStats(videoUrl: string) {
  const videoId = extractYouTubeId(videoUrl)
  if (!videoId) {
    return { error: "Invalid YouTube URL", viewCount: 0, likeCount: 0, commentCount: 0 }
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return { error: "YouTube API key not configured", viewCount: 0, likeCount: 0, commentCount: 0 }
  }

  try {
    const response = await youtube.videos.list({
      key: apiKey,
      part: ["statistics"],
      id: [videoId],
    })

    const video = response.data.items?.[0]
    if (!video || !video.statistics) {
      return { error: "Video not found or no statistics available", viewCount: 0, likeCount: 0, commentCount: 0 }
    }

    return {
      viewCount: parseInt(video.statistics.viewCount || "0", 10),
      likeCount: parseInt(video.statistics.likeCount || "0", 10),
      commentCount: parseInt(video.statistics.commentCount || "0", 10),
    }
  } catch (err) {
    console.error("YouTube API error:", err)
    return { error: "YouTube API request failed", viewCount: 0, likeCount: 0, commentCount: 0 }
  }
}
