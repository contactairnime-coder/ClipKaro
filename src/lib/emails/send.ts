const FROM = "ClipKaro <noreply@clipkaro.in>"

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn(`[Email] RESEND_API_KEY not set. Would send to ${to}: ${subject}`)
    return { sent: false, reason: "RESEND_API_KEY not configured" }
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`[Email] Failed to send to ${to}: ${err}`)
      return { sent: false, error: err }
    }

    console.log(`[Email] Sent to ${to}: ${subject}`)
    return { sent: true }
  } catch (err) {
    console.error(`[Email] Error sending to ${to}:`, err)
    return { sent: false, error: String(err) }
  }
}
