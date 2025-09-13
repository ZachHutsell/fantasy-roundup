import Game from "../models/game.js";
import {
  getDbPromise,
  getAllPromise,
  getCloseDbPromise,
} from "../../db/db-utils.js";

class GameRepo {
  constructor() {}

  async findByWeek(season, week) {
    const db = await getDbPromise();
    const rows = await getAllPromise(
      db,
      "SELECT * FROM games WHERE season = ? AND week = ?",
      [season, week]
    );
    await getCloseDbPromise(db);
    return rows.map(this.mapRow);
  }

  async batchInsert(games) {
    const db = await getDbPromise();
    await db.serialize(() => {
      const stmt = db.prepare(
        "INSERT INTO games (id, season, week, away_team, home_team, away_score, home_score) VALUES (?, ?, ?, ?, ?, ?, ?)"
      );

      games.forEach((game) => {
        stmt.run(
          game.id,
          game.season,
          game.week,
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

  mapRow(row) {
    return new Game(
      row.id,
      row.season,
      row.week,
      row.away_team,
      row.home_team,
      row.away_score,
      row.home_score
    );
  }
}

const repo = new GameRepo();

export default repo;
