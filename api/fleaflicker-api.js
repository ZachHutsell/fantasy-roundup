import axios from "axios";
import constants from "../constants.js";
import Game from "../models/game.js";
import Team from "../models/team.js";
import PlayerPerformance from "../models/player-performance.js";

class FleaflickerApi {
  constructor() {}

  async fetchGames(season, week) {
    const url = `https://www.fleaflicker.com/api/FetchLeagueScoreboard?sport=NFL&league_id=${constants.LEAGUE_ID}&season=${season}&scoring_period=${week}`;
    const data = await fetch(url);
    return data.games.map((game) => {
      return new Game(
        game.id,
        season,
        week,
        game.away.id,
        game.home.id,
        game.awayScore.score.value,
        game.homeScore.score.value
      );
    });
  }

  async fetchTeams(season) {
    const url = `https://www.fleaflicker.com/api/FetchLeagueStandings?sport=NFL&league_id=${constants.LEAGUE_ID}&season=${season}`;
    const data = await fetch(url);
    return data.divisions[0].teams.map((team) => {
      return new Team(
        team.id,
        season,
        team.name,
        team.pointsFor.value,
        team.pointsAgainst.value
      );
    });
  }

  async fetchPlayerPerformances(gameId) {
    //TODO
    const perfs = [];

    const url = `https://www.fleaflicker.com/api/FetchLeagueBoxscore?sport=NFL&league_id=${constants.LEAGUE_ID}&fantasy_game_id=${gameId}`;
    const data = await fetch(url);

    data.lineups.forEach((lineup) => {
      const starter =
        !!lineup.slots[0].position.group &&
        lineup.slots[0].position.group === "START";

      lineup.slots.forEach((slot) => {
        const awayPlayer = createPlayerPerformance(
          slot,
          gameId,
          "away",
          starter
        );
        const homePlayer = createPlayerPerformance(
          slot,
          gameId,
          "home",
          starter
        );
        perfs.push(awayPlayer, homePlayer);
      });
    });

    return perfs.filter((item) => !!item);
  }
}

async function fetch(url) {
  console.log(url);
  const response = await axios.get(url);
  return response.data;
}

function createPlayerPerformance(slot, gameId, teamType, starter) {
  if (slot.position.label === "IR") {
    return null;
  }
  const player = slot[teamType];
  return new PlayerPerformance(
    gameId,
    player.proPlayer.id,
    player.owner.id,
    starter,
    player.proPlayer.nameShort,
    player.proPlayer.position,
    player.proPlayer.proTeamAbbreviation,
    player.viewingActualPoints.value,
    JSON.stringify(player.viewingActualStats)
  );
}

const api = new FleaflickerApi();

export default api;
