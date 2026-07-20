import 'dotenv/config';
import path from 'node:path';

export const config = {
  port: Number(process.env.PORT || 3333),
  host: process.env.HOST || '0.0.0.0',
  sqlitePath: path.resolve(process.env.SQLITE_PATH || './data/chekit.sqlite'),
  postgresUrl: process.env.POSTGRES_URL || '',
  postgresSsl: process.env.POSTGRES_SSL === 'true'
};
