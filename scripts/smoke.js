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
  },
  {
    id: 2,
    name: 'myristate',
    causes_acne: true,
    description: 'Non-Face Reality smoke test row.',
    comedogenic_score: 4,
    face_reality: false
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

  const faceRealityResponse = await server.inject({
    method: 'GET',
    url: '/ingredients?faceReality=true'
  });

  if (faceRealityResponse.statusCode !== 200) {
    throw new Error(faceRealityResponse.body);
  }

  const faceRealityBody = JSON.parse(faceRealityResponse.body);
  if (
    faceRealityBody.onlyFaceReality !== true
    || faceRealityBody.data.length !== 1
    || faceRealityBody.data[0].name !== 'coconut oil'
    || faceRealityBody.data.some((ingredient) => ingredient.faceReality !== true)
  ) {
    throw new Error(JSON.stringify(faceRealityBody, null, 2));
  }

  const questionsResponse = await server.inject({
    method: 'GET',
    url: '/routine-blueprint/questions'
  });

  if (questionsResponse.statusCode !== 200) {
    throw new Error(questionsResponse.body);
  }

  const questionsBody = JSON.parse(questionsResponse.body);
  if (questionsBody.data.length !== 10 || questionsBody.data[0].id !== 'middaySkinFeel') {
    throw new Error(JSON.stringify(questionsBody, null, 2));
  }

  const routineResponse = await server.inject({
    method: 'POST',
    url: '/api/routine-blueprint',
    payload: {
      answers: {
        middaySkinFeel: 'combo',
        afterCleansingFeel: 'comfortable',
        topConcerns: ['breakouts', 'clogged_pores', 'dryness'],
        breakoutFrequency: 'weekly',
        productReactivity: 'sometimes',
        drynessLevel: 'mild',
        currentProducts: ['cleanser', 'moisturizer'],
        activeFrequency: 'one_two_weekly',
        sunscreenFrequency: 'outside_only',
        helpGoal: 'acne'
      },
      lead: {
        instagram: '@chekitclient',
        consentToContact: true
      },
      source: 'smoke'
    }
  });

  if (routineResponse.statusCode !== 200) {
    throw new Error(routineResponse.body);
  }

  const routineBody = JSON.parse(routineResponse.body);
  if (
    routineBody.resultId !== 'routine_blueprint_v1'
    || routineBody.skinProfile.type !== 'combination'
    || !routineBody.skinProfile.concerns.includes('acne')
    || routineBody.delivery.status !== 'skipped'
    || routineBody.leadScore !== 'qualified'
  ) {
    throw new Error(JSON.stringify(routineBody, null, 2));
  }

  console.log('Smoke test passed.');
} finally {
  await server.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
}
