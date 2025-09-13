import {
  getDbPromise,
  getAllPromise,
  getCloseDbPromise
} from "../../db/db-utils.js";

class PlayerRepo {
  constructor() { }

  async getIds() {
    const db = await getDbPromise();
    const rows = await getAllPromise(
      db,
      "SELECT id FROM players",
      []
    );
    await getCloseDbPromise(db);
    return rows.map(row => row.id);
  }

  async clearAndBatchInsert(players) {//TODO rename
    const existingPlayers = await this.getIds();
    const db = await getDbPromise();
  
    await db.serialize(() => {
      const stmt = db.prepare(
        "INSERT INTO players (id, name, position, pro_team, sportradar_id) VALUES (?, ?, ?, ?, ?)"
      );

      players.forEach((player) => {
        if (!existingPlayers.includes(player.id)) {
          stmt.run(
            player.id,
            player.name,
            player.position,
            player.proTeam,
            player.sportradarId
          );
        } else {
          console.log(`Skipping insert of player ${JSON.stringify(player)}`);
        }
      });

      stmt.finalize();

      console.log(`${players.length} players inserted`);
    });
    
    await getCloseDbPromise(db);
  }
}

const repo = new PlayerRepo();

export default repo;
