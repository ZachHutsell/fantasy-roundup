import {
  getDbPromise,
  getAllPromise,
  getCloseDbPromise,
} from "../db-utils.js";
import Team from "../models/team.js";

 class TeamRepo {
  constructor() {}

  async findBySeason(season: number): Promise<Team[]> {
    const db = await getDbPromise();
    const rows = await getAllPromise(
      db,
      "SELECT id, season, name, points_for, points_against FROM teams WHERE season = ?",
      [season]
    );
    await getCloseDbPromise(db);
    return rows.map(mapRow);
  }

  async batchInsert(teams: Team[]) {
    const db = await getDbPromise();

    await db.serialize(() => {
      const stmt = db.prepare(
        `
        INSERT INTO teams (id, season, name, points_for, points_against) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT (id) DO UPDATE SET points_for=excluded.points_for, points_against=excluded.points_against
        `,
      );

      teams.forEach((team) => {
        stmt.run(team.id, team.season, team.name, team.pointsFor, team.pointsAgainst);
      });

      stmt.finalize();

      console.log(`${teams.length} teams inserted or updated`);
    });

    await getCloseDbPromise(db);
  }
}

  function mapRow(row: any): Team {
    return new Team(row.id, row.season, row.name, row.points_for, row.points_against);
  }

const repo = new TeamRepo();

export default repo;
