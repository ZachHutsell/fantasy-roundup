import pug from "pug";
import fs from "fs";
import statsService from "./stats-service.js";
import constants from "../common/constants.js";

const templateLocation = "./src/show/templates/layout.pug";

async function main() {
  const week = constants.WEEK;
  console.log("Generating HTML for week" + week);

  const html = await renderLayout(week),
    location = getRenderLocation(week);

  writeFile(location, html);
}

async function renderLayout(week: number) {
  const teamPgPoints = await statsService.getTeamPositionGroupPointsByWeek(
      week
    ),
    teamBench = await statsService.getTeamPointsOnBenchByWeek(week),
    qbRanks = await statsService.getPositionGroupRankingsByWeek(week, "QB"),
    rbRanks = await statsService.getPositionGroupRankingsByWeek(week, "RB"),
    wrRanks = await statsService.getPositionGroupRankingsByWeek(week, "WR"),
    teRanks = await statsService.getPositionGroupRankingsByWeek(week, "TE");

  return pug.renderFile(templateLocation, {
    weekNum: week,
    teamPgPoints: teamPgPoints,
    teamPgPointsHeaders: getTeamPositionGroupPointsHeaders(),
    teamBench: teamBench,
    teamBenchHeaders: getTeamPointsHeaders("Points on Bench"),
    qbRanks: qbRanks,
    qbRanksHeaders: getPlayerGroupRankingsHeaders(),
    rbRanks: rbRanks,
    rbRanksHeaders: getPlayerGroupRankingsHeaders(),
    wrRanks: wrRanks,
    wrRanksHeaders: getPlayerGroupRankingsHeaders(),
    teRanks: teRanks,
    teRanksHeaders: getPlayerGroupRankingsHeaders(),
  });
}

function getTeamPointsHeaders(pointsHeader: string): Object {
  const headers: any = {};
  headers["Team"] = "team";
  headers[pointsHeader] = "points";
  return headers;
}

function getPlayerGroupRankingsHeaders(): Object {
  return {
    Player: "player",
    Points: "points",
    Team: "team",
    Starter: "starter",
    "Draft Rank": "draftRank",
    "Weekly Rank": "weeklyRank",
    "Value Over Draft": "valueOverDraft",
  };
}

function getTeamPositionGroupPointsHeaders(): Object {
  return {
    Team: "team",
    QB: "qbPoints",
    WR: "wrPoints",
    RB: "rbPoints",
    TE: "tePoints",
    K: "kPoints",
    "D/ST": "dstPoints",
    Total: "totalPoints",
  };
}

// Write the HTML string to a new file
function writeFile(location: string, html: string) {
  fs.writeFile(location, html, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log(`${location} created successfully`);
    }
  });
}

function getRenderLocation(week: number): string {
  return `./docs/weeks/${week}.html`;
}

await main();
