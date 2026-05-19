import type { Plugin } from "@/lib/plugins/registry";

import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };

import { listScheduledTasksQuery } from "./queries";
import router from "./router";

export default {
	name: "tasks",
	pkgName: pkg.name,
	version: pkg.version,
	router,
	commands: {
		listScheduledTasks: listScheduledTasksQuery,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
} satisfies Plugin;
