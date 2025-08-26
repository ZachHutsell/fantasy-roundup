import axios from "axios";
import constants from "./constants.js";
import Game from "./models/game.js";
import Team from "./models/team.js";

async function fetch(url) {
  console.log(url);
  const response = await axios.get(url);
  return response.data;
}

async function fetchGames(season, week) {
  const url = `https://www.fleaflicker.com/api/FetchLeagueScoreboard?sport=NFL&league_id=${constants.LEAGUE_ID}&season=${season}&scoring_period=${week}`;
  const data = await fetch(url);
  return data.games.map((game) => {
    return new Game(game.id, season, week, game.away.id, game.home.id, game.awayScore.score.value, game.homeScore.score.value);
  });
}

async function fetchTeams(season) {
  const url = `https://www.fleaflicker.com/api/FetchLeagueStandings?sport=NFL&league_id=${constants.LEAGUE_ID}&season=${season}`;
  const data = await fetch(url);
  return data.divisions[0].teams.map((team) => {
    return new Team(team.id, season, team.name, team.pointsFor.value, team.pointsAgainst.value);
  });
}

export { fetchGames, fetchTeams };
