import { getRotatingFileSink } from "@logtape/file";
import {
	configure,
	fromAsyncSink,
	getConsoleSink,
	getLogger,
} from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";
import { LOGS_FILE, WEBHOOK_URL } from "./constants";

await configure({
	sinks: {
		meta: getConsoleSink({ formatter: prettyFormatter }),
		file: getRotatingFileSink(LOGS_FILE, {
			maxSize: 0x400 * 0x400, // 1 MiB
			maxFiles: 5,
		}),
		webhook: fromAsyncSink(async (record) => {
			if (!WEBHOOK_URL) {
				return;
			}

			await fetch(WEBHOOK_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					timestamp: record.timestamp,
					level: record.level,
					message: record.message,
					properties: record.properties,
				}),
			});
		}),
		// console: getConsoleSink({ formatter: prettyFormatter }),
	},
	loggers: [
		{ category: ["logtape", "meta"], sinks: ["meta"], lowestLevel: "warning" },
		{ category: [], sinks: ["file"], lowestLevel: "debug" },
		{ category: ["events"], sinks: WEBHOOK_URL ? ["webhook", "file"] : ["file"], lowestLevel: "info" },
	],
});

export { getLogger };
