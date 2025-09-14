import pug from "pug";
import fs from "fs";
import statsService from './stats-service.js';
import constants from "../../constants.js";

const templateLocation = "./apps/show/templates/layout.pug";

async function main() {
  const week = process.argv[constants.PROG_ARGS.show.week.index];
  if (!week) {
    console.error("Cannot generate page without week");
    return;
  }

  const html = await renderLayout(week),
    location = getRenderLocation(week);

  writeFile(location, html);
}

async function renderLayout(week) {
  const teamRbs = await statsService.getTeamPositionGroupStrengthByWeek(week, 'RB'),
    teamWrs = await statsService.getTeamPositionGroupStrengthByWeek(week, 'WR'),
    teamBench = await statsService.getTeamPointsOnBenchByWeek(week),
    qbRanks = await statsService.getPositionGroupRankingsByWeek(week, 'QB'),
    rbRanks = await statsService.getPositionGroupRankingsByWeek(week, 'RB'),
    wrRanks = await statsService.getPositionGroupRankingsByWeek(week, 'WR'),
    teRanks = await statsService.getPositionGroupRankingsByWeek(week, 'TE');

  return pug.renderFile(templateLocation, {
    weekNum: week,
    teamRbs: teamRbs,
    teamRbsHeaders:  Object.keys(teamRbs[0]),
    teamWrs: teamWrs,
    teamWrsHeaders: Object.keys(teamWrs[0]),
    teamBench: teamBench,
    teamBenchHeaders: Object.keys(teamBench[0]),
    qbRanks: qbRanks,
    qbRanksHeaders: Object.keys(qbRanks[0]),
    rbRanks: rbRanks,
    rbRanksHeaders: Object.keys(rbRanks[0]),
    wrRanks: wrRanks,
    wrRanksHeaders: Object.keys(wrRanks[0]),
    teRanks: teRanks,
    teRanksHeaders: Object.keys(teRanks[0])
  });
}

// Write the HTML string to a new file
function writeFile(location, html) {
  fs.writeFile(location, html, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log(`${location} created successfully`);
    }
  });
}

function getRenderLocation(week) {
  return `./docs/weeks/${week}.html`;
}

await main();
