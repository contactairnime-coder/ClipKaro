import { sendEmail } from "./send"

export type RejectionData = {
  clipperEmail: string
  clipperName: string
  campaignTitle: string
  reason: string
  appealLink: string
}

export function buildRejectionEmail(data: RejectionData) {
  return {
    subject: `[ClipKaro] Submission Rejected — ${data.campaignTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b7280;">Submission Update</h2>
        <p>Hi ${data.clipperName},</p>
        <p>Your submission for <strong>${data.campaignTitle}</strong> has been reviewed and was not approved.</p>
        <p><strong>Reason:</strong> ${data.reason}</p>
        <p>If you believe this was a mistake, you can:</p>
        <ul>
          <li>Review the campaign guidelines</li>
          <li>Submit a new, compliant clip</li>
          <li><a href="${data.appealLink}">Appeal this decision</a></li>
        </ul>
        <p style="color: #9ca3af; font-size: 12px;">This decision was made by our automated fraud detection system.</p>
      </div>
    `,
  }
}

export async function sendRejectionEmail(data: RejectionData) {
  const email = buildRejectionEmail(data)
  return sendEmail({
    to: data.clipperEmail,
    subject: email.subject,
    html: email.html,
  })
}
