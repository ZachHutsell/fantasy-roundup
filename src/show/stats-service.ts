import type { Database } from "sqlite3";
import {
  getDbPromise,
  getAllPromise,
  getCloseDbPromise,
} from "../common/db-utils.js";
import type {
  PlayerPositionGroupRankingsResult,
  TeamPointsResult,
  TeamPositionGroupPointsResult,
} from "./interfaces.js";

class StatsService {
  constructor() {}

  async getTeamPositionGroupPointsByWeek(
    week: number
  ): Promise<TeamPositionGroupPointsResult[]> {
    const db = await getDbPromise();
    const rows = await getAllPromise(
      db,
      `
        WITH team_points_by_position AS (
            SELECT
                t.name AS team_name,
                ROUND(SUM(CASE WHEN pp.position = 'QB' THEN pp.points ELSE 0 END), 2) AS qb_points,
                ROUND(SUM(CASE WHEN pp.position = 'WR' THEN pp.points ELSE 0 END), 2) AS wr_points,
                ROUND(SUM(CASE WHEN pp.position = 'RB' THEN pp.points ELSE 0 END), 2) AS rb_points,
                ROUND(SUM(CASE WHEN pp.position = 'TE' THEN pp.points ELSE 0 END), 2) AS te_points,
                ROUND(SUM(CASE WHEN pp.position = 'K' THEN pp.points ELSE 0 END), 2) AS k_points,
                ROUND(SUM(CASE WHEN pp.position = 'D/ST' THEN pp.points ELSE 0 END), 2) AS dst_points
            FROM
                player_performances pp
            JOIN teams t ON
                t.id = pp.team_id
            JOIN games g ON
                g.id = pp.game_id
            WHERE
                pp.starter = 1
                AND g.week = ?
            GROUP BY
                t.id,
                t.name)
        SELECT
            team_name AS team,
            qb_points AS qbPoints,
            wr_points AS wrPoints,
            rb_points AS rbPoints,
            te_points AS tePoints,
            k_points AS kPoints,
            dst_points AS dstPoints,
            ROUND(qb_points + wr_points + rb_points + te_points + k_points + dst_points, 2) AS totalPoints
        FROM
            team_points_by_position
        ORDER BY
            totalPoints DESC
      `,
      [week]
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
