import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import ms from "ms";

export const WEBHOOK_URL = process.env.WEBHOOK_URL;
export const CONFIG_DIRECTORY = join(homedir(), ".athena");
export const LOGS_DIRECTORY = join(CONFIG_DIRECTORY, "logs");
export const CACHE_DIR = join(CONFIG_DIRECTORY, "cache");
export const DEFAULT_CACHE_TTL = ms("1 h");

export const LOGS_FILE = join(LOGS_DIRECTORY, "scripts.log");

await mkdir(LOGS_DIRECTORY, {
	recursive: true,
});
