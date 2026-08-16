import cors from '@fastify/cors';
import Fastify from 'fastify';
import { config } from './config.js';
import { checkIngredientInput, initDb, listIngredients } from './db.js';
import { parseIngredients } from './normalize.js';
import { createRoutineBlueprint, hasLeadContact, routineBlueprintQuestions } from './routine-blueprint.js';

export function buildServer() {
  initDb();

  const fastify = Fastify({
    logger: true
  });

  fastify.register(cors, {
    origin: true
  });

  fastify.get('/health', async () => ({
    ok: true,
    service: 'chekit-core'
  }));

  fastify.get('/ingredients', async (request) => {
    const limit = Math.min(Number(request.query.limit || 100), 500);
    const offset = Math.max(Number(request.query.offset || 0), 0);
    const onlyFaceReality = parseBooleanQuery(
      request.query.faceReality ?? request.query.onlyFaceReality
    );

    return {
      data: listIngredients({ limit, offset, onlyFaceReality }),
      limit,
      offset,
      onlyFaceReality
    };
  });

  async function checkIngredients(request, reply) {
    const body = request.body || {};
    const ingredients = parseIngredients(body.ingredients || body.ingredientString);

    if (!ingredients.length) {
      return reply.code(400).send({
        error: 'Provide ingredientString or ingredients.'
      });
    }

    const matches = checkIngredientInput({
      ingredients,
      onlyFaceReality: Boolean(body.onlyFaceReality)
    });

    return {
      inputIngredients: ingredients,
      matchCount: matches.length,
      matches
    };
  }

  fastify.post('/check', checkIngredients);
  fastify.post('/api/check', checkIngredients);

  fastify.get('/routine-blueprint/questions', async () => ({
    data: routineBlueprintQuestions
  }));

  async function submitRoutineBlueprint(request, reply) {
    const body = request.body || {};

    if (!body.answers || typeof body.answers !== 'object') {
      return reply.code(400).send({
        error: 'Provide answers.'
      });
    }

    if (!hasLeadContact(body.lead)) {
      return reply.code(400).send({
        error: 'Provide at least one lead contact: email, phone, or instagram/social.'
      });
    }

    const blueprint = createRoutineBlueprint({
      answers: body.answers,
      lead: body.lead,
      source: body.source,
      widgetId: body.widgetId
    });
    const delivery = await deliverRoutineBlueprint({
      blueprint,
      resultVisibility: config.routineResultVisibility
    });

    return {
      ...blueprint,
      resultVisibility: config.routineResultVisibility,
      delivery
    };
  }

  fastify.post('/routine-blueprint', submitRoutineBlueprint);
  fastify.post('/api/routine-blueprint', submitRoutineBlueprint);

  return fastify;
}

async function deliverRoutineBlueprint({ blueprint, resultVisibility }) {
  if (!config.routineWebhookUrl) {
    return {
      enabled: false,
      status: 'skipped'
    };
  }

  const payload = {
    lead: blueprint.lead,
    answers: blueprint.answers,
    skinProfile: blueprint.skinProfile,
    routine: blueprint.routine,
    flags: blueprint.flags,
    leadScore: blueprint.leadScore,
    recommendedNextStep: blueprint.recommendedNextStep,
    resultVisibility,
    source: blueprint.source,
    widgetId: blueprint.widgetId,
    submittedAt: blueprint.submittedAt
  };

  try {
    const response = await fetch(config.routineWebhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return {
      enabled: true,
      status: response.ok ? 'sent' : 'failed',
      statusCode: response.status
    };
  } catch (error) {
    return {
      enabled: true,
      status: 'failed',
      error: error.message
    };
  }
}

function parseBooleanQuery(value) {
  if (Array.isArray(value)) {
    return parseBooleanQuery(value[0]);
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return false;
  }

  return ['1', 'true', 'yes'].includes(value.toLowerCase());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = buildServer();
  await server.listen({
    port: config.port,
    host: config.host
  });
}
