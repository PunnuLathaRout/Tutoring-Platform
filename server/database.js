const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db'); // Use a file-based database

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT)");
});

module.exports = db;