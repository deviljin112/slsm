import { readdirSync, existsSync } from "fs";

export function getCurrentDirectoryBase() {
	return process.cwd();
}

export function doesFileExist(filePath, selectedFile) {
	return existsSync(filePath + "/" + selectedFile);
}

export function getSubDirectories(rootPath) {
	return readdirSync(rootPath, { withFileTypes: true })
		.filter((sub) => sub.isDirectory())
		.map((sub) => sub.name);
}
