/* TODOS */
//Add some logging library
//Typescript?
import _ from "lodash";
import gameRepo from "../common/repositories/game-repo.js";
import teamRepo from "../common/repositories/team-repo.js";
import playerRepo from "../common/repositories/player-repo.js";
import playerPerformanceRepo from "../common/repositories/player-performance-repo.js";
import fleaflickerApi from "./fleaflicker-api.js";
import constants from "../common/constants.js";
import type Game from "../common/models/game.js";

async function main() {
  const func = process.argv[constants.PROG_ARGS.load.func.index],
    season = castToNumber(process.argv[constants.PROG_ARGS.load.season.index]),
    week = castToNumber(process.argv[constants.PROG_ARGS.load.week.index]);

  switch (func) {
    case constants.PROG_ARGS.load.func.vals.loadPlayers:
      await loadPlayersToDb();
      break;
    case constants.PROG_ARGS.load.func.vals.loadTeams:
      if (!season) {
        console.error("Cannot load teams without season");
        break;
      }
      await loadTeamsToDb(season);
      break;
    case constants.PROG_ARGS.load.func.vals.loadWeekly:
      if (!(season && week)) {
        console.error("Cannot load games without season and week");
        break;
      }
      await loadWeekly(season, week);
      break;
    default:
      console.warn(`No function found for ${func}`);
  }
}

function castToNumber(val: string | undefined): number | null {
  if (val!= undefined) {
    return +val;
  }
  return null;
}

async function loadWeekly(season: number, week: number) {
  await loadGamesToDb(season, week);
  await loadPlayerPerformancesToDb(season, week);
}

//WARNING, THIS WILL CLEAR PLAYERS TABLE AND RELOAD IT!
async function loadPlayersToDb(): Promise<void> {
  const players = await fleaflickerApi.fetchPlayers(100);
  await playerRepo.batchInsert(players);
}

async function loadTeamsToDb(season: number): Promise<void> {
  const existingTeams = await teamRepo.findBySeason(season);
  if (existingTeams.length >= 12) {
    console.log(`Teams already loaded for season ${season}`);
    return;
  }
  const teams = await fleaflickerApi.fetchTeams(season);
  await teamRepo.batchInsert(teams);
}

async function loadGamesToDb(season: number, week: number): Promise<void> {
  const existingGames = await gameRepo.findByWeek(season, week);
  if (gamesLoadedForWeek(existingGames)) {
    console.log(`Games already loaded for season ${season} week ${week}`);
    return;
  }
  const games = await fleaflickerApi.fetchGames(season, week);
  await gameRepo.batchInsert(games);
}

async function loadPlayerPerformancesToDb(season: number, week:number): Promise<void> {
  const games = await gameRepo.findByWeek(season, week);
  if (!gamesLoadedForWeek(games)) {
    console.error(`Games not loaded for ${season} week ${week}`);
    return;
  }

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

function gamesLoadedForWeek(games: Game[]): boolean {
  return games.length === 6;
}

main();
