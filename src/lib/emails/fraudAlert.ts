import { sendEmail } from "./send"

export type FraudAlertData = {
  clipperName: string
  submissionUrl: string
  fraudScore: number
  failedChecks: string[]
  adminLink: string
}

export function buildFraudAlertEmail(data: FraudAlertData) {
  return {
    subject: `[ClipKaro Fraud Alert] High Risk Submission — Score: ${data.fraudScore}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Fraud Alert</h2>
        <p>A submission has been flagged with a high fraud score.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Clipper</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.clipperName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Fraud Score</td><td style="padding: 8px; border: 1px solid #e5e7eb; color: #dc2626; font-weight: bold;">${data.fraudScore}/100</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Submission URL</td><td style="padding: 8px; border: 1px solid #e5e7eb;"><a href="${data.submissionUrl}">View</a></td></tr>
        </table>
        <h3>Failed Checks:</h3>
        <ul>${data.failedChecks.map((c) => `<li>${c}</li>`).join("")}</ul>
        <p><a href="${data.adminLink}" style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Review in Admin Dashboard</a></p>
      </div>
    `,
  }
}

export async function sendFraudAlert(data: FraudAlertData) {
  const email = buildFraudAlertEmail(data)
  return sendEmail({
    to: "soni.110051@gmail.com",
    subject: email.subject,
    html: email.html,
  })
}
