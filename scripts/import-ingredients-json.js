import fs from 'node:fs';
import path from 'node:path';
import { cleanName } from '../src/normalize.js';
import { getDb, initDb, upsertIngredients } from '../src/db.js';

const dataPath = path.resolve(process.env.INGREDIENTS_JSON || './data/ingredients.json');

if (!fs.existsSync(dataPath)) {
  console.error(`Ingredients JSON not found: ${dataPath}`);
  process.exit(1);
}

const rows = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

if (!Array.isArray(rows)) {
  console.error('Ingredients JSON must be an array.');
  process.exit(1);
}

const database = initDb();
database.exec(`
  DELETE FROM ingredient_synonyms;
  DELETE FROM ingredients;
`);

upsertIngredients(rows);
upsertIngredientSynonyms(rows);

console.log(`Imported ${rows.length} ingredients from ${dataPath}`);

function upsertIngredientSynonyms(items) {
  const database = initDb();
  const findIngredient = database.prepare(`
    SELECT id FROM ingredients WHERE normalized_name = ?
  `);
  const insertSynonym = database.prepare(`
    INSERT INTO ingredient_synonyms (ingredient_id, synonym, normalized_synonym)
    VALUES (@ingredientId, @synonym, @normalizedSynonym)
    ON CONFLICT(normalized_synonym) DO UPDATE SET
      ingredient_id = excluded.ingredient_id,
      synonym = excluded.synonym
  `);

  const transaction = database.transaction(() => {
    for (const item of items) {
      const ingredient = findIngredient.get(cleanName(item.name));
      if (!ingredient || !Array.isArray(item.synonyms)) continue;

      for (const synonym of item.synonyms) {
        const normalizedSynonym = cleanName(synonym);
        if (!normalizedSynonym) continue;

        insertSynonym.run({
          ingredientId: ingredient.id,
          synonym,
          normalizedSynonym
        });
      }
    }
  });

  transaction();
  getDb().pragma('wal_checkpoint(TRUNCATE)');
}
