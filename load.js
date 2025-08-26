/* TODOS */
//Add some logging library
//Typescript?
import _ from "lodash";


import { fetchGames, fetchTeams } from "./api.js";
import GameRepo from "./repositories/game-repo.js";
import TeamRepo from "./repositories/team-repo.js";

async function loadGamesToDb(season, week) {
  const gameRepo = new GameRepo();
  const existingGames = await gameRepo.findByWeek(season, week);
  if (existingGames.length >= 6) {
    console.log(`Games already loaded for season ${season} week ${week}`);
    return;
  }
  const games = await fetchGames(season, week);
  gameRepo.batchInsert(games);
}

async function loadTeamsToDb(season) {
  const teamRepo = new TeamRepo();
  const existingTeams = await teamRepo.findBySeason(season);
  if (existingTeams.length >= 12) {
    console.log(`Teams already loaded for season ${season}`);
    return;
  }
  const teams = await fetchTeams(season);
  teamRepo.batchInsert(teams);
}

// TODO use https://www.fleaflicker.com/api/FetchLeagueBoxscore?sport=NFL&league_id=92863&fantasy_game_id=55917248 to get proPlayer scores

async function main() {
  // const season = process.argv[2];
  // const week = process.argv[3];
  const season = 2024;
  const week = 1;
  await loadTeamsToDb(season);
  await loadGamesToDb(season, week);
}

main();
