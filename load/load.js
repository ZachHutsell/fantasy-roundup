/* TODOS */
//Add some logging library
//Typescript?
import _ from "lodash";
import gameRepo from "./repositories/game-repo.js";
import teamRepo from "./repositories/team-repo.js";
import playerRepo from "./repositories/player-repo.js";
import playerPerformanceRepo from "./repositories/player-performance-repo.js";
import fleaflickerApi from "./api/fleaflicker-api.js";
import constants from "../constants.js";

async function main() {
  const func = process.argv[constants.PROG_ARGS.load.func.index],
    season = process.argv[constants.PROG_ARGS.load.season.index],
    week = process.argv[constants.PROG_ARGS.load.week.index];

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

async function loadWeekly(season, week) {
  await loadGamesToDb(season, week);
  await loadPlayerPerformancesToDb(season, week);
}

//WARNING, THIS WILL CLEAR PLAYERS TABLE AND RELOAD IT!
async function loadPlayersToDb() {
  const players = await fleaflickerApi.fetchPlayers();
  await playerRepo.clearAndBatchInsert(players);
}

async function loadTeamsToDb(season) {
  const existingTeams = await teamRepo.findBySeason(season);
  if (existingTeams.length >= 12) {
    console.log(`Teams already loaded for season ${season}`);
    return;
  }
  const teams = await fleaflickerApi.fetchTeams(season);
  await teamRepo.batchInsert(teams);
}

async function loadGamesToDb(season, week) {
  const existingGames = await gameRepo.findByWeek(season, week);
  if (gamesLoadedForWeek(existingGames)) {
    console.log(`Games already loaded for season ${season} week ${week}`);
    return;
  }
  const games = await fleaflickerApi.fetchGames(season, week);
  await gameRepo.batchInsert(games);
}

async function loadPlayerPerformancesToDb(season, week) {
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

function gamesLoadedForWeek(games) {
  return games.length === 6;
}

main();
