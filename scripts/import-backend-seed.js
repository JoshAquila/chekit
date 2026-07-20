import path from 'node:path';
import { createRequire } from 'node:module';
import { upsertIngredients } from '../src/db.js';

const require = createRequire(import.meta.url);
const seedFile = path.resolve(
  process.env.BACKEND_SEED_FILE || '../acne-checker-backend/src/db/seeds/01_ingredients.js'
);
const seedModule = require(seedFile);
const rows = [];

function table(name) {
  if (name !== 'ingredients') {
    throw new Error(`Unexpected seed table: ${name}`);
  }

  return {
    del: async () => {},
    insert: async (items) => {
      rows.push(...items);
    }
  };
}

table.transaction = async (callback) => callback(table);

await seedModule.seed(table);
upsertIngredients(rows);

console.log(`Imported ${rows.length} ingredients from ${seedFile}`);
