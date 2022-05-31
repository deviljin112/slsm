#!/usr/bin/env node

import clear from "clear";
import chalk from "chalk";
import yargs from "yargs";
import figlet from "figlet";
import { hideBin } from "yargs/helpers";
import rainbowPrint from "../lib/rainbow.js";
import { menuAction, serviceAction } from "../lib/utils.js";
import { userPrompts } from "../lib/prompts.js";

const fileNames = {
  install: "package.json",
  deploy: "serverless.yml",
};

const runner = async (install, deploy, services) => {
  let action;
  let servicePath;

  if (!install && !deploy) {
    const response = await userPrompts("action");
    action = response.action;
  } else if (install && deploy) {
    action = "both";
  } else if (install) {
    action = "install";
  } else if (deploy) {
    action = "deploy";
  }

  if (services.length === 0) {
    const response = await userPrompts("service");

    if (response.service === "all") {
      servicePath = null;
    } else {
      const response = await userPrompts("path");
      servicePath = response.path;
    }

    if (action === "both") {
      for (const act of ["install", "deploy"]) {
        await menuAction(act, servicePath, fileNames[act]);
      }
    } else {
      await menuAction(action, servicePath, fileNames[action]);
    }
  } else {
    for (const service of services) {
      if (action === "both") {
        for (const act of ["install", "deploy"]) {
          await serviceAction(act, service, fileNames[act]);
        }
      } else {
        await serviceAction(action, service, fileNames[action]);
      }
    }
  }

  console.log("\n" + chalk.greenBright("Task completed..."));
};

const welcomeScreen = () => {
  clear();

  rainbowPrint(
    figlet.textSync("SLS-Manager", {
      font: "Banner3",
      horizontalLayout: "full",
    })
  );

  console.log("\nPress 'q' to exit at any time...\n");
};

const start = async () => {
  const args = yargs(hideBin(process.argv))
    .command({
      command: "$0 <operand> [service_name]",
      desc: "Applies operand to the specified service",
    })
    .options({
      install: {
        alias: "i",
        type: "boolean",
        default: false,
        description: "Install dependencies",
        demandOption: false,
      },
      deploy: {
        alias: "d",
        type: "boolean",
        default: false,
        description: "Deploy a service",
        demandOption: false,
      },
    })
    .usage("$0", "The default menu interaction")
    .parse();

  welcomeScreen();
  await runner(args.install, args.deploy, args._);
};

start();
