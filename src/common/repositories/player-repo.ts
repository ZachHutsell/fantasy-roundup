import { getDbPromise, getAllPromise, getCloseDbPromise } from "../db-utils.js";
import type Player from "../models/player.js";

class PlayerRepo {
  constructor() {}

  async getIds() {
    const db = await getDbPromise();
    const rows = await getAllPromise(db, "SELECT id FROM players", []);
    await getCloseDbPromise(db);
    return rows.map((row) => row.id);
  }

  async batchInsert(players: Player[]) {
    const db = await getDbPromise();

    await db.serialize(() => {
      const stmt = db.prepare(
        "INSERT OR IGNORE INTO players (id, name, position, pro_team, sportradar_id) VALUES (?, ?, ?, ?, ?)"
      );

      players.forEach((player: Player) => {
        stmt.run(
          player.id,
          player.name,
          player.position,
          player.proTeam,
          player.sportradarId
        );
      });

      stmt.finalize();

      console.log(`${players.length} players inserted`);
    });

    await getCloseDbPromise(db);
  }
}

const repo = new PlayerRepo();

export default repo;
