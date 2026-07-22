import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { Mdbase } from "@/lib/providers/mdbase";

import { MDBASE_COLLECTION_ROOT } from "../lib";
import { createTask } from "../lib/tasks";

type CreateTaskCommandArgs = {
	name: string;
	title?: string;
	priority?: string;
	due?: string;
	scheduled?: string;
	contexts?: string[];
	projects?: string[];
	timeEstimate?: number;
};
export async function createTaskCommand(
	args: CreateTaskCommandArgs,
): Promise<string> {
	const { t } = await getTranslations("tasks");
	let out = "";

	await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

	const task = await createTask(db, args);

	out += task.id;

	await cleanCache(["listScheduledTasksQuery"]);

	logEvent("TaskCreated", {
		message: t("events.taskCreated"),
		properties: task,
	});

	return out;
}
