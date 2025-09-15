import _ from "lodash";
import gameRepo from "../common/repositories/game-repo.js";
import teamRepo from "../common/repositories/team-repo.js";
import playerPerformanceRepo from "../common/repositories/player-performance-repo.js";
import fleaflickerApi from "./fleaflicker-api.js";
import constants from "../common/constants.js";

async function main() {
  const func = process.argv[constants.PROG_ARGS.load.func.index],
    season = constants.SEASON,
    week = constants.WEEK;

  switch (func) {
    case constants.PROG_ARGS.load.func.vals.loadWeekly:
      await loadWeekly(season, week);
      break;
    default:
      console.warn(`No function found for ${func}`);
  }
}

async function loadWeekly(season: number, week: number) {
  await loadTeamsToDb(season);
  await loadGamesToDb(season, week);
  await loadPlayerPerformancesToDb(season, week);
}

async function loadTeamsToDb(season: number): Promise<void> {
  const teams = await fleaflickerApi.fetchTeams(season);
  await teamRepo.batchInsert(teams);
}

async function loadGamesToDb(season: number, week: number): Promise<void> {
  const games = await fleaflickerApi.fetchGames(season, week);
  await gameRepo.batchInsert(games);
}

async function loadPlayerPerformancesToDb(season: number, week:number): Promise<void> {
  const games = await gameRepo.findByWeek(season, week);
  const gameIds = games.map((game) => game.id);
  for (const gameId of gameIds) {
    const existingPerformances = await playerPerformanceRepo.findByGame(gameId);
    if (existingPerformances.length > 0) {
      console.log(`Performances already loaded for game ${gameId}`);
    } else {
      const perfs = await fleaflickerApi.fetchPlayerPerformances(gameId);
      await playerPerformanceRepo.batchInsert(perfs);
    }
  }
}

main();
