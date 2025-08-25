import axios from "axios";
import constants from "./constants.js";

async function fetch(url) {
  console.log(url);
  const response = await axios.get(url);
  return response.data;
}

async function fetchGames(season, scoringPeriod) {
  const url = `https://www.fleaflicker.com/api/FetchLeagueScoreboard?sport=NFL&league_id=${constants.LEAGUE_ID}&season=${season}&scoring_period=${scoringPeriod}`;
  const data = await fetch(url);
  return data.games.map((game) => {
    return {
      id: game.id,
      season: season,
      scoringPeriod: scoringPeriod,
      awayTeam: game.away.id,
      homeTeam: game.home.id,
      awayScore: game.awayScore.score.value,
      homeScore: game.homeScore.score.value,
    };
  });
}

export { fetchGames };
