const { Client } = require("pg");
require("dotenv").config({ path: ".env.local", override: true });

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
  await client.connect();
  console.log("✓ Connected");

  // Drop existing tables
  const tables = ["fraud_flags", "view_snapshots", "submissions", "campaigns", "payouts", "transactions", "creator_profiles", "profiles", "sessions", "accounts", "verification_tokens", "users"];
  for (const t of tables) {
    await client.query(`DROP TABLE IF EXISTS "${t}" CASCADE`);
  }
  console.log("✓ Old tables dropped");

  // Drop enums
  await client.query('DROP TYPE IF EXISTS "UserRole" CASCADE');
  await client.query('DROP TYPE IF EXISTS "CampaignStatus" CASCADE');
  await client.query('DROP TYPE IF EXISTS "PayoutStatus" CASCADE');
  console.log("✓ Old enums dropped");

  // Create fresh enums
  await client.query(`DO $$ BEGIN CREATE TYPE "UserRole" AS ENUM ('CREATOR', 'CLIPPER', 'ADMIN'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
  await client.query(`DO $$ BEGIN CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
  await client.query(`DO $$ BEGIN CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
  await client.query(`DO $$ BEGIN CREATE TYPE "SubmissionPlatform" AS ENUM ('YOUTUBE_SHORTS', 'INSTAGRAM_REELS', 'TIKTOK'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
  await client.query(`DO $$ BEGIN CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
  await client.query(`DO $$ BEGIN CREATE TYPE "FraudFlagType" AS ENUM ('VIEW_VELOCITY', 'ENGAGEMENT_RATIO', 'ACCOUNT_AGE', 'DUPLICATE', 'GEOGRAPHIC'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
  await client.query(`DO $$ BEGIN CREATE TYPE "TransactionType" AS ENUM ('CREATOR_DEPOSIT', 'PLATFORM_FEE', 'CLIPPER_EARNING', 'WITHDRAWAL'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
  console.log("✓ Enums created");

  // Create tables
  await client.query(`
    CREATE TABLE "profiles" (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      avatar TEXT,
      role "UserRole" DEFAULT 'CLIPPER',
      upi_id TEXT,
      total_earned DOUBLE PRECISION DEFAULT 0,
      total_withdrawn DOUBLE PRECISION DEFAULT 0,
      is_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);

  await client.query(`
    CREATE TABLE "creator_profiles" (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      channel_name TEXT,
      youtube_channel_id TEXT,
      instagram_handle TEXT,
      follower_count INTEGER DEFAULT 0,
      total_bounty_spent DOUBLE PRECISION DEFAULT 0,
      is_approved BOOLEAN DEFAULT false
    );
  `);

  await client.query(`
    CREATE TABLE "campaigns" (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      source_video_url TEXT NOT NULL,
      bounty_total DOUBLE PRECISION DEFAULT 0,
      bounty_per_lakh_views DOUBLE PRECISION DEFAULT 0,
      platform_fee DOUBLE PRECISION DEFAULT 0,
      remaining_bounty DOUBLE PRECISION DEFAULT 0,
      status "CampaignStatus" DEFAULT 'DRAFT',
      allowed_platforms TEXT[] DEFAULT '{}',
      min_clip_duration INTEGER DEFAULT 15,
      max_clip_duration INTEGER DEFAULT 60,
      guidelines TEXT,
      start_date TIMESTAMP,
      end_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      creator_id TEXT NOT NULL REFERENCES profiles(id)
    );
  `);

  await client.query(`
    CREATE TABLE "submissions" (
      id TEXT PRIMARY KEY,
      submitted_url TEXT NOT NULL,
      platform "SubmissionPlatform" NOT NULL,
      status "SubmissionStatus" DEFAULT 'PENDING',
      view_count INTEGER DEFAULT 0,
      last_synced_at TIMESTAMP,
      earnings_calculated DOUBLE PRECISION DEFAULT 0,
      rejection_reason TEXT,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      campaign_id TEXT NOT NULL REFERENCES campaigns(id),
      clipper_id TEXT NOT NULL REFERENCES profiles(id)
    );
  `);

  await client.query(`
    CREATE TABLE "view_snapshots" (
      id TEXT PRIMARY KEY,
      view_count INTEGER NOT NULL,
      recorded_at TIMESTAMP DEFAULT now(),
      submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE
    );
  `);

  await client.query(`
    CREATE TABLE "payouts" (
      id TEXT PRIMARY KEY,
      amount DOUBLE PRECISION NOT NULL,
      status "PayoutStatus" DEFAULT 'PENDING',
      upi_id TEXT NOT NULL,
      razorpay_payout_id TEXT,
      created_at TIMESTAMP DEFAULT now(),
      paid_at TIMESTAMP,
      clipper_id TEXT NOT NULL REFERENCES profiles(id)
    );
  `);

  await client.query(`
    CREATE TABLE "fraud_flags" (
      id TEXT PRIMARY KEY,
      flag_type "FraudFlagType" NOT NULL,
      details TEXT,
      is_resolved BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT now(),
      submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE
    );
  `);

  await client.query(`
    CREATE TABLE "transactions" (
      id TEXT PRIMARY KEY,
      type "TransactionType" NOT NULL,
      amount DOUBLE PRECISION NOT NULL,
      reference_id TEXT,
      created_at TIMESTAMP DEFAULT now(),
      user_id TEXT NOT NULL REFERENCES profiles(id)
    );
  `);

  console.log("✓ All tables created");
  await client.end();
}

run().catch(e => { console.error("Error:", e.message); process.exit(1); });
