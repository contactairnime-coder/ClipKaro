# Fix List — ClipKaro

**App URL:** https://clip-karo-4wbs-qsw5cb71c-airnime.vercel.app

---

## Issues to Fix

| # | Issue | Status |
|---|-------|--------|
| 3 | Verification email link opens localhost:3000 instead of Vercel URL | ⏳ Fix: change Site URL in Supabase Dashboard → Authentication → Settings |
| 4 | Sign in / Sign up with Google — "Unsupported provider: provider is not enabled" on both pages | ⏳ Fix: enable Google provider in Supabase Dashboard → Authentication → Providers + configure Google Cloud Console OAuth |

---

## Fixed Issues

| # | Issue | Fix |
|---|-------|-----|
| 1 | Signout crash | Added hardcoded fallback URL in signout route |
| 2 | Creator analytics/settings 404 | Created both pages |
| 5 | Admin User Management: View dead, Ban no confirm | View → dialog with user details; Ban → confirm step + unban toggle + list refresh |
| 6 | Clipper submission 403 (new signup profile not created) | Auth callback auto-creates profile from metadata; signup page no longer calls failed API |
| 7 | Creator approve/reject buttons do nothing | Changed API to redirect back to campaign page after processing |
| 8 | Earnings UPI ID not pre-filled | Added profile fetch to auto-fill UPI input |
| 9 | `/auth/complete-profile` only POST (405 on GET) | Replaced with proper page + new `/api/complete-profile` endpoint |
| 10 | Ban API didn't update profile isVerified | Added `prisma.profile.update` for isVerified on ban/unban |

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clipkaro.com | Admin@123 |
| Creator | creator@clipkaro.com | Creator@123 |
| Clipper | clipper@clipkaro.com | Clipper@123 |
