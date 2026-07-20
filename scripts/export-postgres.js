import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';
import { config } from '../src/config.js';

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

const outPath = path.resolve('./data/ingredients.export.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(result.rows, null, 2));

console.log(`Exported ${result.rowCount} ingredients to ${outPath}`);
