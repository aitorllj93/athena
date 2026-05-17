import { listScheduledTasksCommand } from "./commands/list-scheduled-tasks";
import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import router from "./router";

export default {
	name: "tasks",
	router,
	commands: {
		listScheduledTasks: listScheduledTasksCommand,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
};
