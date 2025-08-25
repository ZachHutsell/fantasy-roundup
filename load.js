/* TODOS */
//Add some logging library
//Typescript?
import _ from "lodash";


import { fetchGames } from "./api.js";
import GameRepo from "./repositories/game-repo.js";

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

// TODO use https://www.fleaflicker.com/api/FetchLeagueBoxscore?sport=NFL&league_id=92863&fantasy_game_id=55917248 to get proPlayer scores

async function main() {
  const season = process.argv[2];
  const week = process.argv[3];
  loadGamesToDb(season, week);
}

main();
