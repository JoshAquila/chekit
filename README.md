# ChekIt Core

Small local Fastify service for ChekIt ingredient matching.

## AI Setup Summary

If you are an AI helping set this repo up, do this first:

```bash
cd /Users/clank/Projects/ChekIt/chekit-core
npm install
cp .env.example .env
npm run init-db
npm run import-data
npm run smoke
npm run dev
```

Then verify:

```bash
curl -s http://127.0.0.1:3333/health
curl -s -X POST http://127.0.0.1:3333/api/check \
  -H 'content-type: application/json' \
  -d '{"ingredientString":"Water, Cocos Nucifera, Isopropyl Myristate"}'
```

Expected result: `Cocos Nucifera` matches `Coconut Oil`, and `Isopropyl Myristate` matches `Myristate`.

## What It Does

- Stores ingredient items in SQLite.
- Builds the local SQLite database from the checked-in `data/ingredients.json` seed.
- Checks a submitted ingredient list against canonical ingredient names and known synonyms.
- Generates a free Routine Blueprint from standard skincare quiz answers.
- Optionally sends Routine Blueprint lead payloads to a webhook.
- Returns matched ingredients with synonym details.
- Runs locally with Node or Docker Compose.

## Setup

### Fork And Clone

If you want to contribute:

1. Fork `https://github.com/JoshAquila/chekit`.
2. Clone your fork:

```bash
git clone https://github.com/<your-username>/chekit.git
cd chekit
```

3. Install dependencies and build the local SQLite database:

```bash
cp .env.example .env
npm install
npm run import-data
npm run dev
```

The API listens on `http://localhost:3333` by default.

For local data:

```bash
npm run import-data
```

## Docker

```bash
cp .env.example .env
docker compose up --build
```

SQLite is stored in the `chekit-core-data` Docker volume.

## Render Deploy

This repo includes `render.yaml` for Render Blueprint deploys.

Important Render behavior:

- Render does not deploy `docker-compose.yml` directly for this service.
- Render builds from `Dockerfile` via `runtime: docker`.
- The service binds to `HOST=0.0.0.0` and Render's `PORT=10000`.
- SQLite is stored on a persistent Render disk mounted at `/app/storage`.
- `preDeployCommand: npm run import-data` builds SQLite from `/app/seed/ingredients.json` before the service starts.

Deploy steps:

1. Push this repo to GitHub.
2. In Render, create a new Blueprint from the repo.
3. Select the `render.yaml` Blueprint.
4. Deploy and verify `/health`.

No Postgres URL is required for the public open-source deploy path. ChekIt Core builds SQLite from `data/ingredients.json`.

## Ingredient Data

The public data source is `data/ingredients.json`. Each ingredient includes:

- `name`
- `causes_acne`
- `description`
- `face_reality`
- `comedogenic_score`
- `synonyms`

To rebuild local SQLite from the public data file:

```bash
npm run import-data
```

## Import From Postgres

Private maintainers can refresh data from Postgres when they have credentials. Set `POSTGRES_URL` in `.env`, then run:

```bash
npm run import-postgres
```

To export the current Postgres ingredient rows to JSON instead:

```bash
npm run export-postgres
```

That writes `data/ingredients.export.json`.

## Import From The Existing Backend Seed

This is a legacy fallback for local development:

```bash
npm run import-backend-seed
```

By default it reads `../acne-checker-backend/src/db/seeds/01_ingredients.js`.

## Frontend Copy Script

Copy `examples/chekit-core-client.js` into the frontend, or import it directly during local development.

Basic usage:

```js
import { createChekItCoreClient } from './chekit-core-client.js';

const chekit = createChekItCoreClient({
  baseUrl: import.meta.env?.VITE_CHEKIT_CORE_URL || 'http://localhost:3333'
});

const result = await chekit.checkIngredients({
  ingredientString: 'Water, Cocos Nucifera, Isopropyl Myristate'
});

console.log(result.matches);
```

Suggested frontend env var:

```bash
VITE_CHEKIT_CORE_URL=http://localhost:3333
```

## API

### `GET /health`

Returns service health.

### `GET /ingredients?limit=100&offset=0`

Returns SQLite ingredient rows and their synonyms.

Use `faceReality=true` to return only ingredients flagged by Face Reality:

```bash
curl -s "http://127.0.0.1:3333/ingredients?faceReality=true&limit=100"
```

### `POST /api/check`

Checks an ingredient list. `/check` is also registered locally, but `/api/check` is the recommended hosted endpoint.

Request:

```json
{
  "ingredientString": "Water, Cocos Nucifera, Glycerin",
  "onlyFaceReality": false
}
```

You can also pass an array:

```json
{
  "ingredients": ["Water", "Cocos Nucifera", "Glycerin"]
}
```

Response:

```json
{
  "inputIngredients": ["water", "cocos nucifera", "glycerin"],
  "matchCount": 1,
  "matches": [
    {
      "id": 1,
      "name": "coconut oil",
      "normalizedName": "coconut oil",
      "causesAcne": true,
      "description": "Example",
      "comedogenicScore": 4,
      "comedogenicRating": "high",
      "faceReality": true,
      "synonyms": ["cocos nucifera"],
      "matchedInputs": [
        {
          "input": "cocos nucifera",
          "normalizedInput": "coconut oil",
          "matchedVia": "synonym",
          "synonym": "cocos nucifera"
        }
      ]
    }
  ]
}
```

### `GET /routine-blueprint/questions`

Returns the standard Routine Blueprint question set for frontend builders.

```bash
curl -s "http://127.0.0.1:3333/routine-blueprint/questions"
```

### `POST /api/routine-blueprint`

Generates a free skincare routine blueprint from standard quiz answers. `/routine-blueprint` is also registered locally, but `/api/routine-blueprint` is the recommended hosted endpoint.

Lead capture is required in v1. The user must provide at least one contact field before the API returns a Routine Blueprint: email, phone, Instagram, or social. Webhook delivery is still optional.

Request:

```json
{
  "answers": {
    "middaySkinFeel": "combo",
    "afterCleansingFeel": "comfortable",
    "topConcerns": ["breakouts", "clogged_pores"],
    "breakoutFrequency": "weekly",
    "productReactivity": "sometimes",
    "drynessLevel": "mild",
    "currentProducts": ["cleanser", "moisturizer"],
    "activeFrequency": "one_two_weekly",
    "sunscreenFrequency": "outside_only",
    "helpGoal": "acne"
  },
  "lead": {
    "name": "Jane Client",
    "email": "jane@example.com",
    "instagram": "@janeclient",
    "consentToContact": true
  },
  "source": "homepage",
  "widgetId": "main-routine-quiz"
}
```

Response:

```json
{
  "resultId": "routine_blueprint_v1",
  "summary": "Your answers suggest combination-leaning skin with acne, clogged pores, and dryness, a watch barrier signal, and inconsistent sun protection.",
  "skinProfile": {
    "type": "combination",
    "concerns": ["acne", "clogged_pores", "dryness"],
    "barrier": "watch",
    "sunProtection": "inconsistent"
  },
  "routine": {
    "morning": [
      "Gentle cleanser",
      "Lightweight moisturizer",
      "Broad-spectrum sunscreen",
      "Make sunscreen the non-negotiable last step"
    ],
    "evening": [
      "Gentle cleanser",
      "Barrier-supporting moisturizer"
    ],
    "weekly": [
      "Introduce one acne-safe active slowly, one to two nights per week"
    ]
  },
  "flags": [
    "Prioritize daily sunscreen before brightening products"
  ],
  "leadScore": "qualified",
  "recommendedNextStep": "Use a simple acne-safe routine and consider a professional review if breakouts are frequent.",
  "resultVisibility": "show_results",
  "delivery": {
    "enabled": false,
    "status": "skipped"
  },
  "disclaimer": "Educational only. Not medical advice."
}
```

When `ROUTINE_WEBHOOK_URL` is configured, the API posts the lead, answers, profile, routine, flags, lead score, next step, visibility mode, timestamp, source, and widget id to that URL.

If no lead contact is provided, the API returns `400`:

```json
{
  "error": "Provide at least one lead contact: email, phone, or instagram/social."
}
```

#### Routine Blueprint Lead Storage

Routine Blueprint v1 does not store lead submissions in SQLite. SQLite stays focused on public ingredient/reference data.

Use `ROUTINE_WEBHOOK_URL` to save leads somewhere useful for the esthetician. The recommended v1 path is:

1. Create a Zapier Catch Hook.
2. Paste the hook URL into Render as `ROUTINE_WEBHOOK_URL`.
3. Add a Zapier action that writes each submission to Google Sheets.

The webhook payload includes the lead contact fields, raw answers, scored skin profile, generated routine, flags, lead score, source, widget id, and submission timestamp. If `ROUTINE_WEBHOOK_URL` is unset, the API still returns the Routine Blueprint and marks delivery as skipped, but the lead is not saved by ChekIt Core.

## Important Files

- `src/server.js`: Fastify app and routes.
- `src/db.js`: SQLite schema, imports, list/check queries.
- `src/normalize.js`: ingredient parsing and synonym normalization.
- `data/ingredients.json`: public ingredient data seed.
- `scripts/import-ingredients-json.js`: builds SQLite from `data/ingredients.json`.
- `scripts/import-postgres-to-sqlite.js`: pulls private Postgres ingredients into SQLite when credentials are available.
- `scripts/import-backend-seed.js`: imports checked-in backend seed data.
- `examples/chekit-core-client.js`: copy-paste frontend API client.
- `docs/routine-blueprint.md`: Routine Blueprint product, scoring, and webhook notes.
- `data/chekit.sqlite`: generated local SQLite DB, ignored by git.

## Environment Variables

- `PORT`: API port. Default: `3333`.
- `HOST`: API host. Default: `0.0.0.0`.
- `SQLITE_PATH`: SQLite database path. Default: `./data/chekit.sqlite`.
- `POSTGRES_URL`: optional Postgres connection string for private maintainer import/export scripts.
- `POSTGRES_SSL`: set to `true` for hosted Postgres requiring SSL.
- `ROUTINE_WEBHOOK_URL`: optional webhook endpoint for Routine Blueprint lead delivery and v1 lead storage through tools like Zapier and Google Sheets. The API still requires lead contact fields when this is unset.
- `ROUTINE_RESULT_VISIBILITY`: frontend hint for post-submit behavior. Default: `show_results`. Supported values: `show_results`, `confirmation_only`.

## License

This project is licensed under AGPL-3.0-only. The full license text is in `LICENSE`.

## Notes

This service does not mutate the existing Bitbucket backend. It is a standalone open-source ChekIt core.
