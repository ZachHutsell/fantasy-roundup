/* TODOS */
//Add some logging library
//Typescript?
import _ from "lodash";
import gameRepo from "./repositories/game-repo.js";
import teamRepo from "./repositories/team-repo.js";
import playerPerformanceRepo from "./repositories/player-performance-repo.js";
import fleaflickerApi from "./api/fleaflicker-api.js";

const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

async function main() {
  const season = process.argv[2];
  const week = process.argv[3];
  if (week) {
  } else {
    for (const theWeek of weeks) {
      await loadTeamsToDb(season);
      await loadGamesToDb(season, theWeek);
      await loadPlayerPerformancesToDb(season, theWeek);
    }
  }
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

async function loadTeamsToDb(season) {
  const existingTeams = await teamRepo.findBySeason(season);
  if (existingTeams.length >= 12) {
    console.log(`Teams already loaded for season ${season}`);
    return;
  }
  const teams = await fleaflickerApi.fetchTeams(season);
  await teamRepo.batchInsert(teams);
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
    if (existingPerformances.length >= 32) {
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
