import pug from "pug";
import fs from "fs";
import teamsRepo from "../load/repositories/team-repo.js";
import constants from "../constants.js";

const templateLocation = "./show/templates/layout.pug";

async function main() {
  const week = process.argv[constants.PROG_ARGS.show.week.index];
  if (!week) {
    console.error("Cannot load teams without week");
    return;
  }

  const html = await renderTeamsTable(2025),
    location = getRenderLocation(week);

  writeFile(location, html);
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

async function renderTeamsTable(season) {
  const teams = await teamsRepo.findBySeason(season);
  return createTable(teams);
}

function createTable(data) {
  const headers = Object.keys(data[0]);
  return pug.renderFile(templateLocation, {
    weekNum: 1,
    teamHeaders: headers,
    teamItems: data,
  });
}

function getRenderLocation(week) {
  return `./docs/weeks/${week}.html`;
}

await main();
