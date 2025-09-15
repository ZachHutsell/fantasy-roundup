import type { Database } from "sqlite3";
import {
  getDbPromise,
  getAllPromise,
  getCloseDbPromise,
} from "../common/db-utils.js";
import type {
  PlayerPositionGroupRankingsResult,
  TeamPointsResult,
} from "./interfaces.js";

class StatsService {
  constructor() {}

  async getTeamPositionGroupStrengthByWeek(
    week: number,
    positionGroup: string
  ): Promise<TeamPointsResult[]> {
    const db: Database = await getDbPromise();
    const rows = await getAllPromise(
      db,
      `
        SELECT
            t.name AS team,
            ROUND(SUM(pp.points), 1) AS points
        FROM
            player_performances pp
        JOIN teams t ON
            t.id = pp.team_id
        JOIN games g ON
            g.id = pp.game_id
        WHERE
            pp.starter = 1
            AND pp.position = :positionGroup
            AND g.week = :week
        GROUP BY
            pp.team_id
        ORDER BY
            points DESC
      `,
      { ":positionGroup": positionGroup, ":week": week }
    );
    await getCloseDbPromise(db);
    return rows;
  }

  async getTeamPointsOnBenchByWeek(week: number): Promise<TeamPointsResult[]> {
    const db = await getDbPromise();
    const rows = await getAllPromise(
      db,
      `
        SELECT
            t.name as team,
            ROUND(SUM(pp.points), 1) as points
        FROM
            player_performances pp
        JOIN teams t ON
            t.id = pp.team_id
        JOIN games g ON
            g.id = pp.game_id
            AND g.week = ?
        WHERE
            pp.starter = 0
        GROUP BY
            pp.team_id
        ORDER BY
            points DESC
      `,
      [week]
    );
    await getCloseDbPromise(db);
    return rows;
  }

  async getPositionGroupRankingsByWeek(
    week: number,
    positionGroup: string
  ): Promise<PlayerPositionGroupRankingsResult[]> {
    const db = await getDbPromise();
    const rows = await getAllPromise(
      db,
      `
        WITH draft_ranks AS (
            SELECT
                db.draft_position,
                db.player_id,
                p.name,
                RANK() OVER (
                    ORDER BY
                    db.draft_position ASC) AS rank
            FROM
                draft_board db
            JOIN players p ON
                db.player_id = p.id
            WHERE
                p."position" = :positionGroup
        ),
        weekly_ranks AS (
            SELECT
            pp.player_id,
            pp.starter,
            t.name AS team_name,
            pp.points,
            RANK() OVER (
                ORDER BY
                pp.points DESC) AS rank
            FROM
                player_performances pp
            JOIN players p ON
                p.id = pp.player_id
            JOIN games g ON
                g.id = pp.game_id
            JOIN teams t ON
                t.id = pp.team_id
            WHERE
                p."position" = :positionGroup
            AND pp.points IS NOT NULL
            AND g.week = :week
        )
        SELECT
            p.name player,
            wr.points points,
            wr.team_name team,
            CASE wr.starter WHEN 1 THEN 'Yes' ELSE 'No' END AS starter,
            COALESCE(dr.rank, 0) AS draftRank,
            wr.rank AS weeklyRank,
            CASE
                dr.rank
                WHEN NULL THEN 'N/A'
                ELSE COALESCE(dr.rank, wr.rank) - wr.rank
                END AS valueOverDraft
            FROM
                weekly_ranks wr
            JOIN players p ON
                wr.player_id = p.id
            LEFT JOIN draft_ranks dr ON
                dr.player_id = wr.player_id
            ORDER BY
                weeklyRank
      `,
      { ":positionGroup": positionGroup, ":week": week }
    );
    await getCloseDbPromise(db);
    return rows;
  }
}

const serv = new StatsService();
export default serv;
