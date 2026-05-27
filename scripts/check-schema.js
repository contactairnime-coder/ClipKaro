const { Client } = require("pg");
require("dotenv").config({ path: ".env.local", override: true });

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
  await client.connect();

  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'profiles'
    ORDER BY ordinal_position
  `);
  console.log("profiles columns:");
  res.rows.forEach(r => console.log("  ", r.column_name, "-", r.data_type));

  await client.end();
}

run().catch(e => console.error(e.message));
