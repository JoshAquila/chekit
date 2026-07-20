import { initDb, seedKnownSynonyms } from '../src/db.js';

initDb();
seedKnownSynonyms();
console.log('SQLite database is ready.');
