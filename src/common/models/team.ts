export default class Team {
  id: number;
  season: number;
  name: string;
  pointsFor: number;
  pointsAgainst: number;
  
  constructor(
    id: number,
    season: number,
    name: string,
    pointsFor: number,
    pointsAgainst: number
  ) {
    this.id = id;
    this.season = season;
    this.name = name;
    this.pointsFor = pointsFor;
    this.pointsAgainst = pointsAgainst;
  }
}
