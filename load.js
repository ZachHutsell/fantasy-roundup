const _ = require("lodash");
const axios = require("axios");
// The sqlite3 module provides an interface to work with SQLite databases.
const sqlite3 = require("sqlite3");
// The 'open' function from sqlite3/promises is used for a more modern, promise-based API.
// import { open } from 'sqlite3';

const LEAGUE_ID = "92863"; // Replace with your league ID
const SEASON = "2024"; // Replace with the desired season

async function fetch(url) {
  console.log(url);
  const response = await axios.get(url);
  return response.data;
}

async function fetchGames(scoringPeriod) {
  const url = `https://www.fleaflicker.com/api/FetchLeagueScoreboard?sport=NFL&league_id=${LEAGUE_ID}&season=${SEASON}&scoring_period=${scoringPeriod}`;
  const data = await fetch(url);
  return data.games.map((game) => game.id);
}

// TODO use https://www.fleaflicker.com/api/FetchLeagueBoxscore?sport=NFL&league_id=92863&fantasy_game_id=55917248 to get proPlayer scores

async function main() {
  const scoringPeriod = process.argv[2];
  const games = await fetchGames(scoringPeriod);
  console.log(JSON.stringify(games));
}

main();
