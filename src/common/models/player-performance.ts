export default class PlayerPerformance {
  gameId: number;
  playerId: number;
  teamId: number;
  starter: boolean;
  playerName: string;
  position: string;
  proTeam: string;
  points: number;
  stats: string;

  constructor(
    gameId: number,
    playerId: number,
    teamId: number,
    starter: boolean,
    playerName: string,
    position: string,
    proTeam: string,
    points: number,
    stats: string
  ) {
    this.gameId = gameId;
    this.playerId = playerId;
    this.teamId = teamId;
    this.starter = starter;
    this.playerName = playerName;
    this.position = position;
    this.proTeam = proTeam;
    this.points = points;
    this.stats = stats;
  }
}
