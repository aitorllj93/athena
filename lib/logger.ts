import { getRotatingFileSink } from "@logtape/file";
import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";
import { LOGS_FILE } from "./constants";

await configure({
	sinks: {
		file: getRotatingFileSink(LOGS_FILE, {
			maxSize: 0x400 * 0x400, // 1 MiB
			maxFiles: 5,
		}),
		meta: getConsoleSink({ formatter: prettyFormatter }),
		// console: getConsoleSink({ formatter: prettyFormatter }),
	},
	loggers: [
		{ category: ["logtape", "meta"], sinks: ["meta"], lowestLevel: "warning" },
		{ category: [], sinks: ["file"], lowestLevel: "debug" },
	],
});

export { getLogger };
