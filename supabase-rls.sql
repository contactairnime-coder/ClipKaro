-- Clipr Row Level Security (RLS) Policies
-- Run these in Supabase Dashboard → SQL Editor
-- NOTE: auth.uid() returns UUID, but Prisma creates columns as TEXT,
-- so we cast auth.uid()::text for comparison.

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- CAMPAIGNS
CREATE POLICY "Anyone can read ACTIVE campaigns"
  ON campaigns FOR SELECT
  USING (status = 'ACTIVE' OR auth.uid()::text = creator_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Creator can insert campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid()::text = creator_id);

CREATE POLICY "Creator can update own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid()::text = creator_id OR auth.jwt() ->> 'role' = 'admin');

-- SUBMISSIONS
CREATE POLICY "Clipper can read own submissions"
  ON submissions FOR SELECT
  USING (auth.uid()::text = clipper_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Creator can read submissions for their campaigns"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = submissions.campaign_id
      AND campaigns.creator_id = auth.uid()::text
    )
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Clipper can insert submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid()::text = clipper_id);

CREATE POLICY "Creator can update submission status"
  ON submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = submissions.campaign_id
      AND campaigns.creator_id = auth.uid()::text
    )
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- PAYOUTS
CREATE POLICY "Clipper can read own payouts"
  ON payouts FOR SELECT
  USING (auth.uid()::text = clipper_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can update payouts"
  ON payouts FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Note: These RLS policies work alongside the existing API route checks.
-- API routes use Supabase service_role key (bypasses RLS) for server-side operations.
-- RLS provides defense-in-depth at the database level.
