export default class Player {
  id: number;
  name: string;
  position: string;
  proTeam: string;
  sportradarId: number;
  constructor(
    id: number,
    name: string,
    position: string,
    proTeam: string,
    sportradarId: number
  ) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.proTeam = proTeam;
    this.sportradarId = sportradarId;
  }
}
