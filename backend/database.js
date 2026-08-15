import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'app.db');

export async function connectDB() {
    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        return db;
    } catch(err) {
        console.error('Error opening the database', err.message);
    }
}
