import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { Mdbase } from "@/lib/providers/mdbase";

import { MDBASE_COLLECTION_ROOT } from "../lib";
import { completeTask } from "../lib/tasks";

type CompleteTaskCommandArgs = {
	archive?: boolean;
	name: string;
};
export async function completeTaskCommand({
	archive,
	name,
}: CompleteTaskCommandArgs): Promise<string> {
	const { t } = await getTranslations("tasks");
	const out = "";

	await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

	const task = await completeTask(db, { archive, name });

	await cleanCache(["listScheduledTasksQuery"]);
	
	logEvent("TaskCompleted", {
		message: t("events.taskCompleted"),
		properties: task,
	});

	return out;
}
