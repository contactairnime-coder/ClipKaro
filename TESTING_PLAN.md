# Clipr — Complete Testing Plan

## Flow 1: Signup + Auth
```
1. Open https://clipr.vercel.app
2. Click "Get Started" → /signup
3. Select role: CLIPPER / CREATOR
4. Fill: Name, Email, Password → Submit
5. ✅ Check: "Check your email" message dikhta hai
6. Supabase pe jaake user ko manually confirm karo
   → https://supabase.com/dashboard/project/ujqvjktgiwaxhydmfbag/auth/users
   → User dikhna chahiye
7. /login pe jaao → email/password daalo → Login
8. ✅ Redirect to /dashboard/clipper (ya /dashboard/creator)
```

## Flow 2: Google Login (Manual Test)
```
1. /login pe "Continue with Google" click karo
2. ✅ Google auth page khulta hai
   (NOTE: Abhi Google OAuth configured nahi hai, to error aayega)
```

## Flow 3: Creator — Create Campaign
```
1. Login as CREATOR (creator@clipr.in / Creator@123)
2. /dashboard/creator/campaigns/create
3. Fill:
   - Title: "Test Campaign"
   - Description: "Test description"
   - YouTube URL: koi bhi video link
   - Bounty Total: 5000
   - Bounty per lakh views: 500
   - Platform: YouTube Shorts, Instagram Reels
   - Duration: 15-60 sec
   - End Date: 30 days from now
4. Submit
5. ✅ Campaign "PENDING" status se create hota hai
6. Tabhi admin approve nahi kiya to active nahi hoga
```

## Flow 4: Creator — Add Funds
```
1. /dashboard/creator/campaigns → campaign click karo
2. "Add Funds" button click
3. Amount daalo (e.g. 5000)
4. ✅ Razorpay checkout modal khulta hai
5. UPI / Card se payment karo
   (LIVE keys hain, real payment hogi)
6. ✅ Payment success → redirect to dashboard
7. ✅ Campaign balance update hota hai
```

## Flow 5: Admin — Approve Campaign
```
1. Login as ADMIN (admin@clipr.in / Admin@123)
2. /dashboard/admin/campaigns
3. ✅ Pending campaigns dikhte hain
4. Approve click karo
5. ✅ Campaign ACTIVE ho jata hai
```

## Flow 6: Clipper — Browse & Submit
```
1. Login as CLIPPER (clipper@clipr.in / Clipper@123)
2. /dashboard/clipper
3. ✅ Active campaigns dikhte hain
4. Search / filter by platform use karo
5. Campaign click karo
6. ✅ Campaign detail page opens
7. YouTube URL paste karo (real shorts link)
8. Submit click karo
9. ✅ Submission "PENDING" status se submit hota hai
```

## Flow 7: Clipper — Duplicate Check
```
1. Wahi campaign phir se submit karo (same URL)
2. ✅ Error: "You have already submitted this video"
```

## Flow 8: View Tracking (Manual Test)
```
1. Admin ya Creator login karo
2. /dashboard/creator/campaigns/[id]
3. ✅ Submission list dikhti hai
4. "Refresh Views" button click karo
5. ✅ Views count update hota hai (ya error agar YouTube API limit cross)
```

## Flow 9: Fraud Detection
```
1. Admin login → /dashboard/admin/fraud
2. ✅ Fraude queue dikhti hai (agar koi submission flagged)
3. Check details → score dikhta hai
4. Mark Safe / Confirm Fraud buttons
5. ✅ Action successful
```

## Flow 10: Earnings & Withdraw
```
1. Clipper login → /dashboard/clipper/earnings
2. ✅ Total earnings dikhte hain
3. Agar ₹500+ hain to withdraw button active
4. UPI ID daalo → Submit
5. ✅ Withdrawal request PENDING mein jaata hai
```

## Flow 11: Admin — Payout Process
```
1. Admin login → /dashboard/admin/payouts
2. ✅ Pending payouts dikhte hain
3. Approve click karo
4. ✅ Status PAYMENT_PENDING → PENDING ho jata hai
```

## Flow 12: Admin — User Ban
```
1. Admin login → /dashboard/admin/users
2. ✅ All users list dikhti hai
3. User select → Ban click
4. ✅ User banned (login nahi kar sakta)
```

## Flow 13: Admin — Transactions
```
1. Admin login → /dashboard/admin/transactions
2. ✅ All transactions with type filter
3. Summary (total deposits, payouts) dikhta hai
```

## Flow 14: API Health Check
```
1. Browser mein kholo: https://clipr.vercel.app/api/health
2. ✅ Response:
   {
     "status": "healthy",
     "checks": {
       "database": "connected",
       "redis": "configured"
     }
   }
```

## Flow 15: Sitemap & Robots
```
1. https://clipr.vercel.app/sitemap.xml → ✅ XML dikhe
2. https://clipr.vercel.app/robots.txt → ✅ Text dikhe
```

## Flow 16: Static Pages
```
1. /about → ✅ About page
2. /privacy → ✅ Privacy policy
3. /terms → ✅ Terms of service
4. /contact → ✅ Contact form (submit karo → success message)
```

## Flow 17: Mobile Responsive
```
1. Browser DevTools kholo (F12)
2. Mobile view mein check karo
3. ✅ Landing page, dashboards, buttons sab mobile pe theek dikhte hain
```

## Flow 18: 404 Page
```
1. Browser mein kholo: https://clipr.vercel.app/random-page
2. ✅ 404 page dikhta hai
```

---

## Quick Checklist (Pehle ye karo)

| # | Test | Status |
|---|------|--------|
| 1 | Deploy ho gaya? URL mila? | ⏳ |
| 2 | `/api/health` → `healthy` | ⏳ |
| 3 | Landing page load | ⏳ |
| 4 | Login with admin | ⏳ |
| 5 | Login with creator | ⏳ |
| 6 | Login with clipper | ⏳ |
| 7 | Create campaign | ⏳ |
| 8 | Browse campaigns | ⏳ |

Pehle yeh **Quick Checklist** complete karo. Phir baaki flows.
