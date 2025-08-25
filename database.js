import sqlite3 from "sqlite3";
import constants from "./constants.js";

function getDbPromise() {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(constants.DB_NAME, (err) => {
      if (err) {
        return reject(err);
      }
      // console.log(`Connected to ${constants.DB_NAME}.`);
      resolve(db);
    });
  });
}

function getAllPromise(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getCloseDbPromise(db) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        return reject(err);
      }
      // console.log("connection closed");
      resolve();
    });
  });
}

async function runSetup() {
  const db = await getDbPromise();
  await db.serialize(() => {
    db.run(
      `
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY,
      season INTEGER,
      scoring_period INTEGER,
      away_team INTEGER,
      home_team INTEGER,
      away_score REAL,
      home_score REAL
    );
  `,
      (err) => {
        if (err) {
          console.error(err.message);
        }
        // console.log("games table created.");
      }
    );
  });
  await getCloseDbPromise(db);
}

async function insertGames(games) {
  const db = await getDbPromise();

  db.serialize(() => {
    const stmt = db.prepare(
      "INSERT INTO games (id, season, scoring_period, away_team, home_team, away_score, home_score) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    games.forEach((game) => {
      stmt.run(
        game.id,
        game.season,
        game.scoringPeriod,
        game.awayTeam,
        game.homeTeam,
        game.awayScore,
        game.homeScore
      );
    });

    stmt.finalize();

    console.log(`${games.length} games inserted`);
  });

  await getCloseDbPromise(db);
}

async function getGamesByScoringPeriod(season, scoringPeriod) {
  const db = await getDbPromise();
  return await getAllPromise(
    db,
    "SELECT * FROM games WHERE season = ? AND scoring_period = ?",
    [season, scoringPeriod]
  );
}

export { runSetup, insertGames, getGamesByScoringPeriod };
