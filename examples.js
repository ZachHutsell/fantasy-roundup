async function fetchStandings() {
  const url = `https://www.fleaflicker.com/api/FetchLeagueStandings?sport=NFL&league_id=${LEAGUE_ID}&season=${SEASON}`;
  console.log(url);
  const response = await axios.get(url);
  return response.data.divisions.flatMap((division) =>
    division.teams.map((team) => ({
      team: team.name,
      wins: team.recordOverall.wins,
      losses: team.recordOverall.losses,
      ties: team.recordOverall.overallTies,
      pointsFor: team.pointsFor.value,
      pointsAgainst: team.pointsAgainst.value,
    }))
  );
}

async function fetchTeams() {
  const url = `https://www.fleaflicker.com/api/FetchLeagueRosters?sport=NFL&league_id=${LEAGUE_ID}&season=${SEASON}&scoring_period=1`;
  const response = await axios.get(url);
  return response.data.rosters.map(function (roster) {
    return {
      id: roster.team.id,
      name: roster.team.name,
      players: roster.players.map(function (player) {
        return {
          id: player.proPlayer.id,
          name: player.proPlayer.nameFull,
          position: player.proPlayer.position,
        };
      }),
    };
  });
}
