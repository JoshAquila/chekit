import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chekit-smoke-'));
process.env.SQLITE_PATH = path.join(tempDir, 'chekit-smoke.sqlite');

const [{ buildServer }, { upsertIngredients }] = await Promise.all([
  import('../src/server.js'),
  import('../src/db.js')
]);

upsertIngredients([
  {
    id: 1,
    name: 'coconut oil',
    causes_acne: true,
    description: 'Seed row for local smoke testing.',
    comedogenic_score: 4,
    face_reality: true
  }
]);

const server = buildServer();

try {
  for (const url of ['/check', '/api/check']) {
    const response = await server.inject({
      method: 'POST',
      url,
      payload: {
        ingredientString: 'Water, Cocos Nucifera, Glycerin'
      }
    });

    if (response.statusCode !== 200) {
      throw new Error(response.body);
    }

    const body = JSON.parse(response.body);
    if (
      body.matchCount !== 1
      || body.matches[0].name !== 'coconut oil'
      || body.matches[0].matchedInputs[0].matchedVia !== 'synonym'
    ) {
      throw new Error(JSON.stringify(body, null, 2));
    }
  }

  console.log('Smoke test passed.');
} finally {
  await server.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
}
