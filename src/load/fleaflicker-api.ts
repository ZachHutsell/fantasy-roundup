import axios from "axios";
import constants from "../common/constants.js";
import Game from "../common/models/game.js";
import Team from "../common/models/team.js";
import PlayerPerformance from "../common/models/player-performance.js";
import Player from "../common/models/player.js";

class FleaflickerApi {
  constructor() {}

  async fetchGames(season: number, week: number): Promise<Game[]> {
    const url = `https://www.fleaflicker.com/api/FetchLeagueScoreboard?sport=NFL&league_id=${constants.LEAGUE_ID}&season=${season}&scoring_period=${week}`;
    const data = await fetch(url);
    return data.games.map((game: any) => {
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

  async fetchTeams(season: number): Promise<Team[]> {
    const url = `https://www.fleaflicker.com/api/FetchLeagueStandings?sport=NFL&league_id=${constants.LEAGUE_ID}&season=${season}`;
    const data = await fetch(url);
    return data.divisions[0].teams.map((team: any) => {
      return new Team(
        team.id,
        season,
        team.name,
        team.pointsFor.value,
        team.pointsAgainst.value
      );
    });
  }

  async fetchPlayers(pageLimit: number): Promise<Player[]> {
    let resultOffset = 0,
      pageCount = 0,
      players: Player[] = [];

    while (
      resultOffset != null &&
      (pageLimit == null || pageCount < pageLimit)
    ) {
      const url = `https://www.fleaflicker.com/api/FetchPlayerListing?sport=NFL&league_id=${constants.LEAGUE_ID}&external_id_type=SPORTRADAR&result_offset=${resultOffset}`;
      const data = await fetch(url);

      resultOffset = data.resultOffsetNext;
      pageCount++;

      data.players.forEach((player: any) => {
        const pp = player.proPlayer;
        players.push(
          new Player(
            pp.id,
            pp.nameShort,
            pp.position,
            pp.proTeamAbbreviation,
            pp.externalIds ? pp.externalIds[0].id : null
          )
        );
      });
    }
    return players;
  }

  async fetchPlayerPerformances(gameId: number): Promise<PlayerPerformance[]> {
    const perfs: PlayerPerformance[] = [];

    const url = `https://www.fleaflicker.com/api/FetchLeagueBoxscore?sport=NFL&league_id=${constants.LEAGUE_ID}&fantasy_game_id=${gameId}`;
    const data = await fetch(url);

    data.lineups.forEach((lineup: any) => {
      const starter =
        !!lineup.slots[0].position.group &&
        lineup.slots[0].position.group === "START";

      lineup.slots.forEach((slot: any) => {
        const awayPlayer: PlayerPerformance | null = createPlayerPerformance(
          slot,
          gameId,
          "away",
          starter
        );
        const homePlayer: PlayerPerformance | null = createPlayerPerformance(
          slot,
          gameId,
          "home",
          starter
        );
        if(!!awayPlayer) {
          perfs.push(awayPlayer);
        }
         if(!!homePlayer) {
          perfs.push(homePlayer);
        }
      });
    });

    return perfs.filter((item) => !!item);
  }
}

async function fetch(url: string) {
  console.log(url);
  const response = await axios.get(url);
  return response.data;
}

function createPlayerPerformance(slot: any, gameId: number, teamType: string, starter: boolean): PlayerPerformance | null {
  try {
    if (shouldSkipProcessing(slot, teamType)) {
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
  } catch (err: any) {
    console.error(
      `Issue processing API request: \n ${err.message} \n ${JSON.stringify(
        slot
      )}`
    );
    return null;
  }
}

function shouldSkipProcessing(slot: any, teamType: string) {
  const isInjuredReserve = slot.position.label === "IR";
  if (isInjuredReserve) {
    return true;
  }
  const player = slot[teamType],
    proTeam = player.proPlayer.proTeamAbbreviation,
    isPlayerFreeAgent = proTeam === "FA";

  if (isPlayerFreeAgent) {
    return true;
  }
  const isPlayerBye = player.requestedGames[0].isBye;
  if (isPlayerBye) {
    return true;
  }

  return false;
}

const api = new FleaflickerApi();

export default api;
