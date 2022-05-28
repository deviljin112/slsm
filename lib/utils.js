import {
	getCurrentDirectoryBase,
	getSubDirectories,
	doesFileExist,
} from "./files.js";
import { loadingSpinner } from "./prompts.js";
import chalk from "chalk";
import { execaCommand } from "execa";

const blacklist = ["node_modules", ".serverless", "__pycache__"];

export async function menuAction(action, servicePath, selectedFile) {
	const loaderSpinner = new loadingSpinner(
		`Searching for ${chalk.cyan(selectedFile)} file...`
	);
	loaderSpinner.start();

	const rootPath = getCurrentDirectoryBase();

	let availablePaths;

	if (servicePath) {
		availablePaths = checkPath(`${rootPath}/${servicePath}`, selectedFile);
	} else {
		availablePaths = checkPath(rootPath, selectedFile);
	}

	if (availablePaths.length === 0) {
		loaderSpinner.fail(`No ${chalk.cyan(selectedFile)} files found...`);
	} else {
		loaderSpinner.success();

		const fileSpinner = new loadingSpinner(`${capitalize(action)}ing...`);
		fileSpinner.start();
		for (const iPath of availablePaths) {
			fileSpinner.update(`${capitalize(action)}ing ${chalk.gray(iPath)}`);
			await runCmdInPath(cmd(action), iPath);
		}
		fileSpinner.success();
	}
}

export async function serviceAction(action, service, selectedFile) {
	const rootPath = getCurrentDirectoryBase();
	const outputPaths = checkPath(rootPath, selectedFile);

	let installed = false;

	const fileSpinner = new loadingSpinner(`${capitalize(action)}ing...`);
	fileSpinner.start();
	for (const out of outputPaths) {
		if (out.includes(service)) {
			fileSpinner.update(`${capitalize(action)}ing ${chalk.gray(out)}`);
			await runCmdInPath(cmd(action), out);
			installed = true;
		}
	}
	if (installed) {
		fileSpinner.success();
	} else {
		fileSpinner.fail("No matching service found.");
	}
}

const checkPath = (givenPath, selectedFile) => {
	let availablePaths = [];

	if (doesFileExist(givenPath, selectedFile)) {
		availablePaths.push(givenPath);
	} else {
		const subDirs = getSubDirectories(givenPath);
		for (const sub of subDirs) {
			if (!blacklist.includes(sub)) {
				const checkedPath = `${givenPath}/${sub}`;
				if (doesFileExist(checkedPath, selectedFile)) {
					availablePaths.push(checkedPath);
				} else {
					const output = checkPath(checkedPath, selectedFile);
					availablePaths = availablePaths.concat(output);
				}
			}
		}
	}
	return availablePaths;
};

const runCmdInPath = async (cmd, commandPath) => {
	const output = await execaCommand(cmd, { cwd: commandPath });
	if (output.failed) {
		throw output.stderr;
	}
};

const cmd = (action) => {
	if (action === "install") {
		return "npm i";
	}

	if (action === "deploy") {
		return "sls deploy";
	}
};

const capitalize = (text) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};
