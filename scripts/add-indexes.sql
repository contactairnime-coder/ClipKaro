-- ClipKaro Database Indexes
-- Run this in Supabase Dashboard SQL Editor
-- Adds indexes for 10k+ user scalability

-- Campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_creator_id ON campaigns(creator_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_creator_status ON campaigns(creator_id, status);
CREATE INDEX IF NOT EXISTS idx_campaigns_status_created ON campaigns(status, created_at);

-- Submissions
CREATE INDEX IF NOT EXISTS idx_submissions_campaign_id ON submissions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_submissions_clipper_id ON submissions(clipper_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_platform ON submissions(platform);
CREATE INDEX IF NOT EXISTS idx_submissions_last_synced ON submissions(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_submissions_campaign_status ON submissions(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_clipper_status ON submissions(clipper_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_status_synced ON submissions(status, last_synced_at);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_url ON submissions(submitted_url);

-- View Snapshots
CREATE INDEX IF NOT EXISTS idx_view_snapshots_submission_id ON view_snapshots(submission_id);
CREATE INDEX IF NOT EXISTS idx_view_snapshots_recorded ON view_snapshots(submission_id, recorded_at);

-- Payouts
CREATE INDEX IF NOT EXISTS idx_payouts_clipper_id ON payouts(clipper_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_created_at ON payouts(created_at);
CREATE INDEX IF NOT EXISTS idx_payouts_clipper_status ON payouts(clipper_id, status);
CREATE INDEX IF NOT EXISTS idx_payouts_status_created ON payouts(status, created_at);

-- Transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_reference_id ON transactions(reference_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Fraud Flags
CREATE INDEX IF NOT EXISTS idx_fraud_flags_submission_id ON fraud_flags(submission_id);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_is_resolved ON fraud_flags(is_resolved);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_submission_resolved ON fraud_flags(submission_id, is_resolved);

-- Creator Profiles
CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON creator_profiles(user_id);
