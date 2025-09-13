import pug from "pug";
import fs from "fs";

// Compile the Pug file to an HTML string
const templateLocation = "./frontend/templates/index.pug",

  html = pug.renderFile(templateLocation);

// Write the HTML string to a new file
fs.writeFile("index.html", html, (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log("index.html created successfully!");
  }
});
