import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { Mdbase } from "@/lib/providers/mdbase";
import { MDBASE_COLLECTION_ROOT, updateTask } from "../lib";

type UpdateTaskCommandArgs = {
	name: string;
	title?: string;
	priority?: string;
	due?: string;
	scheduled?: string;
	contexts?: string[];
	projects?: string[];
	timeEstimate?: number;
};
export async function updateTaskCommand(
	args: UpdateTaskCommandArgs,
): Promise<string> {
	const { t } = await getTranslations("tasks");
	let out = "";

	await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

	const task = await updateTask(db, args);

	out += task.id;

	await cleanCache(["listScheduledTasksQuery"]);

	logEvent("TaskUpdated", {
		message: t("events.taskUpdated"),
		properties: task,
	});

	return out;
}
