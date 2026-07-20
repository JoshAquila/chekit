import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from './config.js';
import { cleanName, getComedogenicRating, normalizeIngredientName, synonymMap } from './normalize.js';

let db;

export function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(config.sqlitePath), { recursive: true });
    db = new Database(config.sqlitePath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }

  return db;
}

export function initDb() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      normalized_name TEXT NOT NULL UNIQUE,
      causes_acne INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      comedogenic_score INTEGER,
      face_reality INTEGER NOT NULL DEFAULT 0,
      source_updated_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ingredient_synonyms (
      id INTEGER PRIMARY KEY,
      ingredient_id INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
      synonym TEXT NOT NULL,
      normalized_synonym TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_ingredients_normalized_name
      ON ingredients(normalized_name);

    CREATE INDEX IF NOT EXISTS idx_ingredient_synonyms_normalized_synonym
      ON ingredient_synonyms(normalized_synonym);
  `);

  return database;
}

export function upsertIngredients(rows) {
  const database = initDb();
  const upsert = database.prepare(`
    INSERT INTO ingredients (
      id,
      name,
      normalized_name,
      causes_acne,
      description,
      comedogenic_score,
      face_reality,
      source_updated_at,
      updated_at
    )
    VALUES (
      @id,
      @name,
      @normalizedName,
      @causesAcne,
      @description,
      @comedogenicScore,
      @faceReality,
      @sourceUpdatedAt,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT(normalized_name) DO UPDATE SET
      name = excluded.name,
      causes_acne = excluded.causes_acne,
      description = COALESCE(excluded.description, ingredients.description),
      comedogenic_score = excluded.comedogenic_score,
      face_reality = excluded.face_reality,
      source_updated_at = excluded.source_updated_at,
      updated_at = CURRENT_TIMESTAMP
  `);

  const transaction = database.transaction((items) => {
    for (const row of items) {
      const name = String(row.name || '').trim();
      if (!name) continue;
      if (isKnownTestIngredient(row)) continue;

      upsert.run({
        id: row.id || null,
        name,
        normalizedName: cleanName(name),
        causesAcne: row.causes_acne || row.causesAcne ? 1 : 0,
        description: row.description || null,
        comedogenicScore: row.comedogenic_score ?? row.comedogenicScore ?? null,
        faceReality: row.face_reality || row.faceReality ? 1 : 0,
        sourceUpdatedAt: row.updated_at || row.updatedAt || null
      });
    }
  });

  transaction(rows);
  seedKnownSynonyms();
}

function isKnownTestIngredient(row) {
  const normalizedName = cleanName(row.name);
  return normalizedName === 'testing ingredients'
    || normalizedName === 'testing two';
}

export function seedKnownSynonyms() {
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
    for (const [synonym, canonical] of Object.entries(synonymMap)) {
      const ingredient = findIngredient.get(cleanName(canonical));
      if (!ingredient) continue;

      insertSynonym.run({
        ingredientId: ingredient.id,
        synonym,
        normalizedSynonym: cleanName(synonym)
      });
    }
  });

  transaction();
}

export function listIngredients({ limit = 100, offset = 0 } = {}) {
  const database = initDb();
  const rows = database
    .prepare(`
      SELECT i.*
      FROM ingredients i
      ORDER BY i.name ASC
      LIMIT ? OFFSET ?
    `)
    .all(limit, offset);
  const synonymsForIngredient = database.prepare(`
    SELECT synonym FROM ingredient_synonyms WHERE ingredient_id = ? ORDER BY synonym ASC
  `);

  return rows.map((row) => mapIngredientRow(
    row,
    synonymsForIngredient.all(row.id).map((entry) => entry.synonym)
  ));
}

export function checkIngredientInput({ ingredients, onlyFaceReality = false }) {
  const database = initDb();
  const normalizedInputs = ingredients.map((ingredient) => ({
    raw: ingredient,
    normalized: normalizeIngredientName(ingredient),
    cleaned: cleanName(ingredient)
  }));

  const direct = database.prepare(`
    SELECT *, NULL AS matched_synonym
    FROM ingredients
    WHERE normalized_name = ?
      AND (? = 0 OR face_reality = 1)
  `);
  const synonym = database.prepare(`
    SELECT i.*, s.synonym AS matched_synonym
    FROM ingredient_synonyms s
    JOIN ingredients i ON i.id = s.ingredient_id
    WHERE s.normalized_synonym = ?
      AND (? = 0 OR i.face_reality = 1)
  `);
  const synonymsForIngredient = database.prepare(`
    SELECT synonym FROM ingredient_synonyms WHERE ingredient_id = ? ORDER BY synonym ASC
  `);

  const matchesByIngredient = new Map();

  for (const item of normalizedInputs) {
    const row = synonym.get(item.cleaned, onlyFaceReality ? 1 : 0)
      || direct.get(item.normalized, onlyFaceReality ? 1 : 0)
      || direct.get(item.cleaned, onlyFaceReality ? 1 : 0);

    if (!row) continue;

    const existing = matchesByIngredient.get(row.id);
    const matchDetail = {
      input: item.raw,
      normalizedInput: item.normalized,
      matchedVia: row.matched_synonym ? 'synonym' : 'name',
      synonym: row.matched_synonym || null
    };

    if (existing) {
      existing.matchedInputs.push(matchDetail);
      continue;
    }

    matchesByIngredient.set(row.id, {
      ...mapIngredientRow(row, synonymsForIngredient.all(row.id).map((entry) => entry.synonym)),
      matchedInputs: [matchDetail]
    });
  }

  return Array.from(matchesByIngredient.values());
}

function mapIngredientRow(row, synonymsOverride) {
  const synonyms = synonymsOverride ?? [];

  return {
    id: row.id,
    name: row.name,
    normalizedName: row.normalized_name,
    causesAcne: Boolean(row.causes_acne),
    description: row.description,
    comedogenicScore: row.comedogenic_score,
    comedogenicRating: getComedogenicRating(row.comedogenic_score),
    faceReality: Boolean(row.face_reality),
    synonyms
  };
}
