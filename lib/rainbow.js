// Original Source: https://github.com/robertmarsal/lolcatjs/blob/master/index.js

import chalk from "chalk";
import ansi from "ansi";

const cursor = ansi(process.stdout);
let seed = Math.round(Math.random() * 1000);

const colourize = (char, colour) => {
  process.stdout.write(chalk.rgb(colour.r, colour.g, colour.b)(char));
};

const rainbow = (seed) => {
  const r = Math.round(Math.sin(0.3 * seed + 0) * 127 + 128);
  const g = Math.round(Math.sin(0.3 * seed + 2 * (Math.PI / 3)) * 127 + 128);
  const b = Math.round(Math.sin(0.3 * seed + 4 * (Math.PI / 3)) * 127 + 128);

  return { r, g, b };
};

const printLine = (line) => {
  cursor.show();

  for (let i = 0; i < line.length; i++) {
    colourize(line[i], rainbow(seed + i / 8.0));
  }

  process.stdout.write("\n");
};

const rainbowPrint = (str) => {
  const lines = str.split("\n");
  lines.forEach((line) => {
    seed += 1;
    printLine(line);
    cursor.show();
  });
};

export default rainbowPrint;
