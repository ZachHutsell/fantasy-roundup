import {
  getDbPromise,
  getAllPromise,
  getCloseDbPromise,
} from "../db-utils.js";
import Team from "../models/team.js";
 class TeamRepo {
  constructor() {}

  async findBySeason(season) {
    const db = await getDbPromise();
    const rows = await getAllPromise(
      db,
      "SELECT id, season, name, points_for, points_against FROM teams WHERE season = ?",
      [season]
    );
    await getCloseDbPromise(db);
    return rows.map(mapRow);
  }

  async batchInsert(teams) {
    const db = await getDbPromise();

    await db.serialize(() => {
      const stmt = db.prepare(
        "INSERT INTO teams (id, season, name, points_for, points_against) VALUES (?, ?, ?, ?, ?)",
      );

      teams.forEach((team) => {
        stmt.run(team.id, team.season, team.name, team.pointsFor, team.pointsAgainst);
      });

      stmt.finalize();

      console.log(`${teams.length} teams inserted`);
    });

    await getCloseDbPromise(db);
  }
}

  function mapRow(row) {
    return new Team(row.id, row.season, row.name, row.points_for, row.points_against);
  }

const repo = new TeamRepo();

export default repo;
