import 'dotenv/config';
import path from 'node:path';

const allowedRoutineVisibility = new Set(['show_results', 'confirmation_only']);
const routineResultVisibility = process.env.ROUTINE_RESULT_VISIBILITY || 'show_results';

export const config = {
  port: Number(process.env.PORT || 3333),
  host: process.env.HOST || '0.0.0.0',
  sqlitePath: path.resolve(process.env.SQLITE_PATH || './data/chekit.sqlite'),
  postgresUrl: process.env.POSTGRES_URL || '',
  postgresSsl: process.env.POSTGRES_SSL === 'true',
  routineWebhookUrl: process.env.ROUTINE_WEBHOOK_URL || '',
  routineResultVisibility: allowedRoutineVisibility.has(routineResultVisibility)
    ? routineResultVisibility
    : 'show_results'
};
