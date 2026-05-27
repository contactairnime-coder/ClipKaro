# Fix List — ClipKaro

**App URL:** https://clip-karo-4wbs-qsw5cb71c-airnime.vercel.app

---

## Issues to Fix

> Jab bhi koi issue mile, yahan likho. Phir "fix kro" bolo — main theek kar dunga.

| # | Issue | Status |
|---|-------|--------|
| 1 | Signout: `NEXT_PUBLIC_APP_URL` missing on Vercel — redirect fails | ✅ Fixed |
| 2 | Creator: analytics & settings pages missing — "not found" | ✅ Fixed |
| 3 | Verification email link opens localhost:3000 instead of Vercel URL | ⏳ Fix: change Site URL in Supabase Dashboard → Authentication → Settings |
| 4 | Sign in / Sign up with Google — "Unsupported provider: provider is not enabled" on both pages | ⏳ Fix: enable Google provider in Supabase Dashboard → Authentication → Providers + configure Google Cloud Console OAuth |
| 5 | Admin → User Management: "View" button has no onClick (dead click), "Ban" button has no confirmation/feedback | ⏳ |
| 6 | Clipper → Submit YT video: "Only clippers can submit clips" error + console 403. Likely cause: signup complete-profile fails silently (no session cookie yet), so profile never created | ✅ Working — seed clipper account (clipper@clipkaro.com) can submit successfully |

---

## Fixed Issues

| # | Issue | Fix |
|---|-------|-----|
| 1 | Signout crash | Added hardcoded fallback URL in signout route |
| 2 | Creator analytics/settings 404 | Created both pages |
| 6 | Earnings page UPI ID not auto-filling from saved profile | Added profile fetch to pre-fill UPI ID input |

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clipkaro.com | Admin@123 |
| Creator | creator@clipkaro.com | Creator@123 |
| Clipper | clipper@clipkaro.com | Clipper@123 |
