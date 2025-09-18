export default class Game {
  id: number;
  season: number;
  week: number;
  awayTeam: number;
  homeTeam: number;
  awayScore: number;
  homeScore: number;

  constructor(
    id: number,
    season: number,
    week: number,
    awayTeam: number,
    homeTeam: number,
    awayScore: number,
    homeScore: number
  ) {
    this.id = id;
    this.season = season;
    this.week = week;
    this.awayTeam = awayTeam;
    this.homeTeam = homeTeam;
    this.awayScore = awayScore;
    this.homeScore = homeScore;
  }
}
