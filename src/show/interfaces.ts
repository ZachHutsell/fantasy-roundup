interface PlayerRankingsResults {
  playerName: string;
  pointsScored: number;
  team: string;
  starter: string;
  draftRank: number;
  weeklyRank: number;
  valueOverDraft: number;
}

interface TeamPointsResult {
  team: string;
  points: number;
}

interface PlayerPositionGroupRankingsResult {
  player: string;
  points: number;
  team: string;
  starter: string;
  draftRank: number;
  weeklyRank: number;
  valueOverDraft: number;
}

interface TeamPositionGroupPointsResult {
  team: string;
  qbPoints: number;
  wrPoints: number;
  rbPoints: number;
  tePoints: number;
  kPoints: number;
  dstPoints: number;
  totalPoints: number;
}
export type {
  PlayerRankingsResults,
  TeamPointsResult,
  PlayerPositionGroupRankingsResult,
  TeamPositionGroupPointsResult,
};
