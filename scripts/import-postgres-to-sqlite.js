import { Client } from 'pg';
import { config } from '../src/config.js';
import { upsertIngredients } from '../src/db.js';

if (!config.postgresUrl) {
  console.error('POSTGRES_URL is required.');
  process.exit(1);
}

const client = new Client({
  connectionString: config.postgresUrl,
  ssl: config.postgresSsl ? { rejectUnauthorized: false } : false
});

await client.connect();

const result = await client.query(`
  SELECT
    id,
    name,
    causes_acne,
    description,
    comedogenic_score,
    face_reality,
    updated_at
  FROM ingredients
  ORDER BY id ASC
`);

await client.end();

upsertIngredients(result.rows);

console.log(`Imported ${result.rowCount} Postgres ingredients into SQLite.`);
