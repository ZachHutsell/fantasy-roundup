import { getDbPromise, getAllPromise, getCloseDbPromise } from "../common/db-utils.js";

//{team, pointsByPosition}
class StatsService {
  constructor() {}

  async getTeamPositionGroupStrengthByWeek(week, positionGroup) {
    const db = await getDbPromise();
    const rows = await getAllPromise(
      db,
      `
        SELECT
            t.name AS Team,
            ROUND(SUM(pp.points), 1) AS Points_By_Position
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
            Points_By_Position DESC
      `,
      {':positionGroup': positionGroup, ':week': week}
    );
    await getCloseDbPromise(db);
    return rows;
  }

  async getTeamPointsOnBenchByWeek(week) {
    const db = await getDbPromise();
    const rows = await getAllPromise(
      db,
      `
        SELECT
            t.name as Team,
            ROUND(SUM(pp.points), 1) as Points_On_Bench
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
            Points_On_Bench DESC
      `,
      [week]
    );
    await getCloseDbPromise(db);
    return rows;
  }

  async getPositionGroupRankingsByWeek(week, positionGroup) {
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
            p.name Player_Name,
            wr.points Points_Scored,
            wr.team_name Team,
            CASE wr.starter WHEN 1 THEN 'Yes' ELSE 'No' END AS Starter,
            COALESCE(dr.rank, 0) AS Draft_Rank,
            wr.rank AS Weekly_Rank,
            CASE
                dr.rank
                WHEN NULL THEN 'N/A'
                ELSE COALESCE(dr.rank, wr.rank) - wr.rank
                END AS Value_Over_Draft
            FROM
                weekly_ranks wr
            JOIN players p ON
                wr.player_id = p.id
            LEFT JOIN draft_ranks dr ON
                dr.player_id = wr.player_id
            ORDER BY
                Weekly_Rank
      `,
      {':positionGroup': positionGroup, ':week': week}
    );
    await getCloseDbPromise(db);
    return rows;
  }
}

const serv = new StatsService();
export default serv;
