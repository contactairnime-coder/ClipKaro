# Testing Plan - 100MILLION

## 1. Public Pages

### 1.1 Home Page (/)
- [ ] Page loads without errors
- [ ] All sections render properly
- [ ] Navigation links work
- [ ] Responsive layout

### 1.2 About (/about)
- [ ] Page loads
- [ ] Content displays correctly

### 1.3 Contact (/contact)
- [ ] Page loads
- [ ] Contact form works
- [ ] Form validation
- [ ] Form submission API (`/api/contact`)

### 1.4 Privacy Policy (/privacy)
- [ ] Page loads
- [ ] Content renders

### 1.5 Terms of Service (/terms)
- [ ] Page loads
- [ ] Content renders

### 1.6 404 Not Found
- [ ] Invalid route shows custom 404 page

---

## 2. Authentication

### 2.1 Login (/login)
- [ ] Page loads
- [ ] Login form renders
- [ ] Google OAuth button works
- [ ] Form validation
- [ ] Error handling for invalid credentials
- [ ] Redirect to dashboard on success
- [ ] Redirect to dashboard if already logged in

### 2.2 Signup (/signup)
- [ ] Page loads
- [ ] Signup form renders
- [ ] Role selection (Creator / Clipper)
- [ ] Google OAuth signup
- [ ] Form validation
- [ ] Error handling

### 2.3 Auth Callback (/auth/callback)
- [ ] OAuth callback handles code exchange
- [ ] Google OAuth without code handled gracefully
- [ ] Google OAuth users redirected to role selection
- [ ] Redirect to complete-profile if needed

### 2.4 Complete Profile (/auth/complete-profile)
- [ ] Page loads after signup
- [ ] Profile form (name, UPI ID, etc.)
- [ ] Form validation
- [ ] Submit works via `/api/complete-profile`
- [ ] Redirect to dashboard on success

### 2.5 Signout (/api/auth/signout)
- [ ] Signout clears session
- [ ] Redirect with 303 status
- [ ] User redirected to login page

---

## 3. Dashboard Pages

### 3.1 Dashboard Home (/dashboard)
- [ ] Page loads
- [ ] Role-based redirect (creator/clipper/admin)
- [ ] Shows relevant stats/summary

### 3.2 Dashboard Loading State
- [ ] Loading skeleton shows while fetching

### 3.3 Dashboard Error State
- [ ] Error boundary catches errors
- [ ] Retry option works

---

## 4. Creator Dashboard

### 4.1 Creator Home (/dashboard/creator)
- [ ] Page loads
- [ ] Campaign stats displayed
- [ ] Quick actions available

### 4.2 My Campaigns (/dashboard/creator/campaigns)
- [ ] List of campaigns loads
- [ ] Pagination works
- [ ] Campaign status badges visible
- [ ] Create new campaign button works

### 4.3 Create Campaign (/dashboard/creator/campaigns/create)
- [ ] Form loads with all fields
- [ ] Title, description, platform selection
- [ ] Budget/rate fields
- [ ] Form validation
- [ ] Submit creates campaign via API
- [ ] Redirect to campaign list on success

### 4.4 Campaign Details (/dashboard/creator/campaigns/[id])
- [ ] Campaign details load
- [ ] Edit options available
- [ ] Toggle status (active/paused) works (`/api/campaigns/[id]/toggle-status`)
- [ ] View submissions for this campaign
- [ ] Approve/reject submissions
- [ ] Delete campaign option

### 4.5 Analytics (/dashboard/creator/analytics)
- [ ] Page loads
- [ ] Charts/graphs render
- [ ] Statistics accurate

### 4.6 Add Funds (/dashboard/creator/add-funds)
- [ ] Page loads
- [ ] Amount input
- [ ] Razorpay payment integration
- [ ] Create order API (`/api/payments/create-order`)
- [ ] Payment verification API (`/api/payments/verify`)
- [ ] Webhook handling (`/api/webhooks/razorpay`)

### 4.7 Creator Settings (/dashboard/creator/settings)
- [ ] Page loads
- [ ] Profile update works
- [ ] UPI ID update
- [ ] Notification preferences (if any)

---

## 5. Clipper Dashboard

### 5.1 Clipper Home (/dashboard/clipper)
- [ ] Page loads
- [ ] Available campaigns count
- [ ] Earnings summary
- [ ] Quick stats

### 5.2 Browse Campaigns (/dashboard/clipper/campaigns)
- [ ] Campaign list loads
- [ ] Filters work (platform, payout range, etc.)
- [ ] Pagination works
- [ ] Apply/Submit button works

### 5.3 Campaign Detail (/dashboard/clipper/campaigns/[id])
- [ ] Campaign details load
- [ ] Submission form works
- [ ] Video link upload
- [ ] Submit via API (`/api/submissions`)

### 5.4 My Submissions (/dashboard/clipper/submissions)
- [ ] Submission list loads
- [ ] Status badges (pending/approved/rejected)
- [ ] Pagination works
- [ ] View submission details

### 5.5 My Earnings (/dashboard/clipper/earnings)
- [ ] Page loads
- [ ] Total earnings displayed
- [ ] Withdrawable balance
- [ ] Withdraw request works (`/api/earnings/withdraw`)
- [ ] Withdrawal history (`/api/earnings/withdraw/history`)
- [ ] UPI auto-fill from profile

### 5.6 Clipper Settings (/dashboard/clipper/settings)
- [ ] Page loads
- [ ] Profile update
- [ ] UPI ID update
- [ ] Notification settings

---

## 6. Admin Dashboard

### 6.1 Admin Home (/dashboard/admin)
- [ ] Page loads
- [ ] System-wide stats
- [ ] Quick links to all admin sections

### 6.2 All Campaigns (/dashboard/admin/campaigns)
- [ ] Campaigns list loads
- [ ] Filter by status (pending/active/paused/completed/rejected)
- [ ] Approve/reject campaigns (`/api/admin/campaigns/[id]/approve`, `/api/admin/campaigns/[id]/reject`)
- [ ] Pagination works

### 6.3 Users Management (/dashboard/admin/users)
- [ ] User list loads
- [ ] Search/filter users
- [ ] Ban/unban users (`/api/admin/users/[id]/ban`)
- [ ] User role display
- [ ] Pagination works

### 6.4 Payouts (/dashboard/admin/payouts)
- [ ] Pending payouts list loads
- [ ] Approve/reject payouts (`/api/admin/payouts/[id]/approve`, `/api/admin/payouts/[id]/reject`)
- [ ] Process payout (`/api/admin/payouts/[id]/process`)
- [ ] Razorpay payout webhook (`/api/webhooks/razorpay-payouts`)
- [ ] Pagination works

### 6.5 Transactions (/dashboard/admin/transactions)
- [ ] All transactions list loads
- [ ] Filter by type/status
- [ ] Pagination works

### 6.6 Fraud Detection (/dashboard/admin/fraud)
- [ ] Fraud alerts list loads
- [ ] Mark as confirmed fraud (`/api/admin/fraud/[id]/confirm`)
- [ ] Mark as safe (`/api/admin/fraud/[id]/safe`)
- [ ] Fraud check details (`/api/fraud/check/[submissionId]`)
- [ ] Override fraud decision (`/api/fraud/override/[submissionId]`)
- [ ] Pagination works

### 6.7 Queue Management (/dashboard/admin/queue)
- [ ] Queue stats load (`/api/admin/queue/stats`)
- [ ] Queue status displayed
- [ ] Manual queue trigger (`/api/queue/start`)

---

## 7. API Testing

### 7.1 Campaigns API
- [ ] `GET /api/campaigns` - List campaigns
- [ ] `POST /api/campaigns` - Create campaign
- [ ] `GET /api/campaigns/my` - My campaigns
- [ ] `GET /api/campaigns/[id]` - Campaign details
- [ ] `PATCH /api/campaigns/[id]/toggle-status` - Toggle active/paused

### 7.2 Submissions API
- [ ] `POST /api/submissions` - Create submission
- [ ] `GET /api/submissions/my` - My submissions
- [ ] `PATCH /api/submissions/[id]/approve` - Approve submission
- [ ] `PATCH /api/submissions/[id]/reject` - Reject submission

### 7.3 Earnings API
- [ ] `GET /api/earnings/my` - My earnings
- [ ] `POST /api/earnings/withdraw` - Request withdrawal
- [ ] `GET /api/earnings/withdraw/history` - Withdrawal history

### 7.4 Payments API
- [ ] `POST /api/payments/create-order` - Create Razorpay order
- [ ] `POST /api/payments/verify` - Verify payment signature

### 7.5 Profile API
- [ ] `GET /api/user/profile` - Get profile
- [ ] `PATCH /api/user/profile` - Update profile
- [ ] `GET /api/user/profile/transactions` - User transactions

### 7.6 Sync API
- [ ] `POST /api/sync/views` - Sync YouTube/Instagram views
- [ ] `GET /api/sync/campaign/[id]` - Sync specific campaign views

### 7.7 Fraud API
- [ ] `POST /api/fraud/check/[submissionId]` - Run fraud check
- [ ] `POST /api/fraud/override/[submissionId]` - Override fraud decision

### 7.8 Webhooks
- [ ] `POST /api/webhooks/razorpay` - Razorpay payment webhook
- [ ] `POST /api/webhooks/razorpay-payouts` - Razorpay payout webhook

### 7.9 Cron Jobs
- [ ] `GET /api/cron/sync-views` - Sync scheduled views
- [ ] `GET /api/cron/check-campaigns` - Check campaign statuses
- [ ] `GET /api/cron/process-payouts` - Process pending payouts
- [ ] `GET /api/cron/daily` - Daily maintenance

### 7.10 Health
- [ ] `GET /api/health` - Health check endpoint

---

## 8. Queue System
- [ ] Redis connection works
- [ ] Fraud check worker processes jobs
- [ ] View sync worker processes jobs
- [ ] Earnings worker processes jobs
- [ ] Payout worker processes jobs
- [ ] Email worker sends emails
- [ ] Schedulers trigger on schedule

---

## 9. Fraud Detection System
- [ ] Duplicate check works (duplicate.ts)
- [ ] View spike detection works (viewSpike.ts)
- [ ] Account age check works (accountAge.ts)
- [ ] Engagement ratio check works (engagementRatio.ts)
- [ ] View velocity check works (viewVelocity.ts)
- [ ] Score calculation works (scoreCalculator.ts)
- [ ] Fraud actions trigger correctly (actions.ts)
- [ ] Fraud alert email sent

---

## 10. Email System
- [ ] Submission rejected email (`submissionRejected.ts`)
- [ ] Fraud alert email (`fraudAlert.ts`)
- [ ] Email sending works (`send.ts`)

---

## 11. Platform Integrations
- [ ] YouTube API integration (`youtube.ts`)
- [ ] Instagram API integration (`instagram.ts`)
- [ ] TikTok API integration (`tiktok.ts`)

---

## 12. Security Checks
- [ ] Admin-only routes protected (`admin-check.ts`)
- [ ] Authentication middleware works (`middleware.ts`)
- [ ] Supabase RLS policies active
- [ ] CORS headers set
- [ ] Input validation on all forms
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection
