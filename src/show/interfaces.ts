interface PlayerRankingsResults {
    playerName: string,
    pointsScored: number,
    team: string,
    starter: string,
    draftRank: number,
    weeklyRank: number,
    valueOverDraft: number
}

interface TeamPointsResult {
    team: string,
    points: number
}

interface PlayerPositionGroupRankingsResult {
    player: string,
    points: number,
    team: string,
    starter: string,
    draftRank: number,
    weeklyRank: number
    valueOverDraft: number
}
export type {PlayerRankingsResults, TeamPointsResult, PlayerPositionGroupRankingsResult}