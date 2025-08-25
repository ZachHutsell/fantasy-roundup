/* TODOS */
//Add some logging library
//Typescript?
import _ from "lodash";

import { runSetup, insertGames, getGamesByScoringPeriod } from "./database.js";
import { fetchGames } from "./api.js";

async function loadGamesToDb(season, scoringPeriod) {
  const existingGames = await getGamesByScoringPeriod(season, scoringPeriod);
  if (existingGames.length >= 6) {
    console.log(`Games already loaded for season ${season} week ${scoringPeriod}`);
    return;
  }
  const games = await fetchGames(season, scoringPeriod);
  insertGames(games);
}

// TODO use https://www.fleaflicker.com/api/FetchLeagueBoxscore?sport=NFL&league_id=92863&fantasy_game_id=55917248 to get proPlayer scores

async function main() {
  await runSetup();
  const season = process.argv[2];
  const week = process.argv[3];
  loadGamesToDb(season, week);
}

main();
