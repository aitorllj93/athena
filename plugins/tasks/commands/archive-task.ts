import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { Mdbase } from "@/lib/providers/mdbase";

import { MDBASE_COLLECTION_ROOT } from "../lib";
import { archiveTask } from "../lib/tasks";

type ArchiveTaskCommandArgs = {
	name: string;
};
export async function archiveTaskCommand({
	name,
}: ArchiveTaskCommandArgs): Promise<string> {
	const { t } = await getTranslations("tasks");
	const out = "";

	await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

	const task = await archiveTask(db, { name });

	await cleanCache(["listScheduledTasksQuery"]);

	logEvent("TaskArchived", {
		message: t("events.taskArchived"),
		properties: task,
	});

	return out;
}
