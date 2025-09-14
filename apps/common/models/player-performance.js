export default class PlayerPerformance {
  constructor(
    gameId,
    playerId,
    teamId,
    starter,
    playerName,
    position,
    proTeam,
    points,
    stats
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
