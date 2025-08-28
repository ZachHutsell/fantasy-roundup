import sqlite3 from "sqlite3";
import constants from "../constants.js";

let db = new sqlite3.Database(constants.DB_PATH, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Connected to ${constants.DB_PATH}.`);
});

db.serialize(() => {
  //teams
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY,
      season INTEGER,
      name text,
      points_for INTEGER,
      points_against INTEGER
    );
  `);

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

  //player_performances
  db.run(`
    CREATE TABLE IF NOT EXISTS player_performances (
      game_id INTEGER,
      player_id INTEGER,
      team_id INTEGER,
      starter BOOLEAN,
      player_name TEXT,
      position TEXT,
      pro_team TEXT,
      points REAL,
      stats TEXT,
      PRIMARY KEY (game_id, player_id),
      FOREIGN KEY (game_id) REFERENCES games(id),
      FOREIGN KEY (team_id) REFERENCES teams(id)
    );
  `);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Database setup complete.");
});
