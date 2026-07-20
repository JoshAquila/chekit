import cors from '@fastify/cors';
import Fastify from 'fastify';
import { config } from './config.js';
import { checkIngredientInput, initDb, listIngredients } from './db.js';
import { parseIngredients } from './normalize.js';

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

    return {
      data: listIngredients({ limit, offset }),
      limit,
      offset
    };
  });

  fastify.post('/check', async (request, reply) => {
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
  });

  return fastify;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = buildServer();
  await server.listen({
    port: config.port,
    host: config.host
  });
}
