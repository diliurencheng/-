const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT,
    quantity INTEGER,
    location TEXT,
    qr_code TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'user')) DEFAULT 'user',
    last_login DATETIME
  )`);
});

module.exports = db;