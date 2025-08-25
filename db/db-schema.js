import sqlite3 from "sqlite3";
import constants from "../constants.js";

let db = new sqlite3.Database(constants.DB_PATH, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Connected to ${constants.DB_NAME}.`);
});

db.serialize(() => {
  //games
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY,
      season INTEGER,
      week INTEGER,
      away_team INTEGER,
      home_team INTEGER,
      away_score REAL,
      home_score REAL
    );
  `);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Database setup complete.');
});
