import {
  getDbPromise,
  getAllPromise,
  getCloseDbPromise,
} from "../db-utils.js";

import PlayerPerformance from "../models/player-performance.js";

class PlayerPerformanceRepo {
  constructor() {}

  async findByGame(gameId) {
    const db = await getDbPromise();
    const rows = await getAllPromise(
      db,
      "SELECT * FROM player_performances WHERE game_id = ?",
      [gameId]
    );
    await getCloseDbPromise(db);
    return rows.map(mapRow);
  }

  async batchInsert(performances) {
    const db = await getDbPromise();

    try {
      await db.serialize(() => {
        const stmt = db.prepare(
          "INSERT INTO player_performances " +
            "(game_id, player_id, team_id, starter, player_name, position, pro_team, points, stats) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        performances.forEach((perf) => {
          stmt.run(
            perf.gameId,
            perf.playerId,
            perf.teamId,
            perf.starter,
            perf.playerName,
            perf.position,
            perf.proTeam,
            perf.points,
            perf.stats
          );
        });

        stmt.finalize();

        console.log(`${performances.length} performances inserted`);
      });
    } catch (err) {
      console.error(
        `Failed to insert performances, likely due to already being loaded`
      );
    } 

    await getCloseDbPromise(db);
  }
}

function mapRow(row) {
  return new PlayerPerformance(
    row.game_id,
    row.player_id,
    row.team_id,
    row.starter,
    row.player_name,
    row.position,
    row.pro_team,
    row.points,
    row.stats
  );
}

const repo = new PlayerPerformanceRepo();

export default repo;
