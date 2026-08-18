// import path from 'path';
// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';
// import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error("CRITICAL: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing from environment variables.");
}

export const db = createClient({
    url: url || 'libsql://dummy-url.turso.io',
    authToken: authToken || '',
});

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const dbPath = path.resolve(__dirname, 'app.db');

// export async function connectDB() {
//     try {
//         const db = await open({
//             filename: dbPath,
//             driver: sqlite3.Database
//         });
//         return db;
//     } catch(err) {
//         console.error('Error opening the database', err.message);
//     }
// }
