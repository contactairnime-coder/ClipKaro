const { Client } = require("pg");
require("dotenv").config({ path: ".env.local", override: true });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

async function run() {
  await client.connect();
  console.log("✓ Connected");

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "UserRole" AS ENUM ('CREATOR', 'CLIPPER', 'ADMIN');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
  console.log("✓ UserRole enum");

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "CampaignStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
  console.log("✓ CampaignStatus enum");

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'REJECTED');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
  console.log("✓ PayoutStatus enum");

  await client.query(`
    CREATE TABLE IF NOT EXISTS "users" (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      email_verified TIMESTAMP,
      image TEXT,
      password TEXT,
      role "UserRole" DEFAULT 'CLIPPER',
      phone TEXT,
      upi_id TEXT,
      bank_account TEXT,
      ifsc_code TEXT,
      balance DOUBLE PRECISION DEFAULT 0,
      total_earned DOUBLE PRECISION DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);
  console.log("✓ users table");

  await client.query(`
    CREATE TABLE IF NOT EXISTS "accounts" (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      UNIQUE(provider, provider_account_id)
    );
  `);
  console.log("✓ accounts table");

  await client.query(`
    CREATE TABLE IF NOT EXISTS "sessions" (
      id TEXT PRIMARY KEY,
      session_token TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TIMESTAMP NOT NULL
    );
  `);
  console.log("✓ sessions table");

  await client.query(`
    CREATE TABLE IF NOT EXISTS "verification_tokens" (
      identifier TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires TIMESTAMP NOT NULL,
      UNIQUE(identifier, token)
    );
  `);
  console.log("✓ verification_tokens table");

  await client.query(`
    CREATE TABLE IF NOT EXISTS "campaigns" (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      brand_name TEXT,
      platform TEXT,
      requirements TEXT,
      reward_per_view DOUBLE PRECISION DEFAULT 0,
      total_budget DOUBLE PRECISION DEFAULT 0,
      spent_amount DOUBLE PRECISION DEFAULT 0,
      max_submissions INTEGER DEFAULT 0,
      current_submissions INTEGER DEFAULT 0,
      status "CampaignStatus" DEFAULT 'PENDING',
      start_date TIMESTAMP,
      end_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      creator_id TEXT NOT NULL REFERENCES users(id)
    );
  `);
  console.log("✓ campaigns table");

  await client.query(`
    CREATE TABLE IF NOT EXISTS "clips" (
      id TEXT PRIMARY KEY,
      title TEXT,
      link TEXT NOT NULL,
      platform TEXT DEFAULT 'instagram',
      views INTEGER DEFAULT 0,
      is_verified BOOLEAN DEFAULT false,
      status "PayoutStatus" DEFAULT 'PENDING',
      reward_earned DOUBLE PRECISION DEFAULT 0,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      campaign_id TEXT NOT NULL REFERENCES campaigns(id),
      clipper_id TEXT NOT NULL REFERENCES users(id)
    );
  `);
  console.log("✓ clips table");

  await client.query(`
    CREATE TABLE IF NOT EXISTS "payouts" (
      id TEXT PRIMARY KEY,
      amount DOUBLE PRECISION NOT NULL,
      status "PayoutStatus" DEFAULT 'PENDING',
      method TEXT,
      transaction_id TEXT,
      notes TEXT,
      processed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      user_id TEXT NOT NULL REFERENCES users(id)
    );
  `);
  console.log("✓ payouts table");

  console.log("\nAll tables created successfully!");
  await client.end();
}

run().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
