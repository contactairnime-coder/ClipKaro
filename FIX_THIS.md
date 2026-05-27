# Fix List — ClipKaro

**App URL:** https://clip-karo-4wbs-qsw5cb71c-airnime.vercel.app

---

## Issues to Fix

| # | Issue | Status |
|---|-------|--------|
| 3 | Verification email link opens localhost:3000 instead of Vercel URL | ✅ Fixed — Site URL change kar diya |
| 4 | Sign in / Sign up with Google — "Unsupported provider: provider is not enabled" on both pages | ✅ Fixed — Google OAuth enabled in Supabase Dashboard + Google Cloud Console config done |

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
| 11 | Build lint errors (unused vars) | Removed unused `data`, `updated` variables |
| 12 | Login/Signup page shows when already logged in | Added session check → redirect to dashboard |

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clipkaro.com | Admin@123 |
| Creator | creator@clipkaro.com | Creator@123 |
| Clipper | clipper@clipkaro.com | Clipper@123 |
