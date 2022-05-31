import ora from "ora";
import inquirer from "inquirer";
import fuzzypath from "inquirer-fuzzy-path";
import InterruptedPrompt from "inquirer-interrupted-prompt";

inquirer.registerPrompt("fuzzypath", fuzzypath);

InterruptedPrompt.replaceAllDefaults(inquirer);

export class loadingSpinner {
  constructor(text) {
    this.spinner = ora(text);
  }

  start() {
    this.spinner.start();
  }

  success() {
    this.spinner.succeed();
  }

  fail(reason) {
    this.spinner.fail(reason);
  }

  update(text) {
    this.spinner.text = text;
  }
}

export async function userPrompts(name) {
  const prompts = {
    action: {
      name: "action",
      message: "Choose an action to perform",
      type: "list",
      choices: ["install", "deploy", "both"],
      interruptedKeyName: "q",
    },
    service: {
      name: "service",
      message: "What path to search",
      type: "list",
      choices: ["all", "specify"],
      interruptedKeyName: "q",
    },
    path: {
      name: "path",
      message: "Select target directory",
      type: "fuzzypath",
      excludePath: (nodePath) => {
        if (/(^|\/)\.[^\/\.]/g.test(nodePath)) return true;
        if (/(^|\/)\_[^\/\.]/g.test(nodePath)) return true;
        if (nodePath.includes("node_modules")) return true;
      },
      excludeFilter: (nodePath) => {
        if (nodePath.startsWith(".")) return true;
      },
      itemType: "directory",
      suggestOnly: false,
      depthLimit: 3,
    },
  };

  try {
    return await inquirer.prompt(prompts[name]);
  } catch (err) {
    if (err === InterruptedPrompt.EVENT_INTERRUPTED) {
      process.exit(1);
    }
  }
}
