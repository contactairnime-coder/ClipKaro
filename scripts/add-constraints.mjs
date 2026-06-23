import { config } from "dotenv"
import { Client } from "pg"

config({ path: ".env.local", override: true })

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  console.log("Connected!")

  // Remove duplicate transactions before adding unique constraint
  await client.query(`
    DELETE FROM transactions t1 USING transactions t2 
    WHERE t1.id < t2.id 
      AND t1.reference_id = t2.reference_id 
      AND t1.type = t2.type
  `)
  console.log("✅ Removed duplicate transactions")

  try {
    await client.query(`
      ALTER TABLE transactions 
      ADD CONSTRAINT transactions_reference_type_unique 
      UNIQUE (reference_id, type)
    `)
    console.log("✅ Unique constraint on transactions.referenceId + type")
  } catch (e) {
    if (e.message?.includes("already exists")) {
      console.log("⏭️ Unique constraint already exists")
    } else {
      throw e
    }
  }

  // Fix negative remaining_bounty before adding check
  await client.query(`
    UPDATE campaigns SET remaining_bounty = 0 WHERE remaining_bounty < 0
  `)
  console.log("✅ Fixed negative remaining_bounty values")

  try {
    await client.query(`
      ALTER TABLE campaigns 
      ADD CONSTRAINT campaigns_remaining_bounty_check 
      CHECK (remaining_bounty >= 0)
    `)
    console.log("✅ Check constraint on campaigns.remaining_bounty >= 0")
  } catch (e) {
    if (e.message?.includes("already exists")) {
      console.log("⏭️ Check constraint already exists")
    } else {
      throw e
    }
  }

  console.log("All constraints added!")
} catch (e) {
  console.error("Error:", e.message)
} finally {
  await client.end()
}
