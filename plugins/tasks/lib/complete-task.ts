import { getTranslations } from "@/lib/i18n";
import type { Mdbase } from "@/lib/providers/mdbase";
import { getTaskNotesFields } from "@/lib/providers/mdbase/tasknotes";

import { lookupTask } from "./lookup-task";
import type { Task } from "./types";

type CompleteTaskParams = {
	name: string;
	archive?: boolean;
};
export async function completeTask(
	db: Mdbase,
	{ archive, name }: CompleteTaskParams,
): Promise<Task> {
	const { t } = await getTranslations("tasks");
	const task = await lookupTask(db, { taskNameOrId: name });

	const typeDef = await db.getType("task");
	const fields = getTaskNotesFields(typeDef);

	if (task.status === "done") {
		console.log(t("alreadyCompleted", { name }));
		return task;
	}

	const res = await db.collection.update({
		path: task.path,
		fields: {
			[fields.status.key]: "done",
			[fields.tags.key]: [
				...(task.tags ?? []),
				...(archive ? ["archive"] : []),
			],
		},
	});

	if (res.error) {
		throw new Error(res.error.message);
	}

	if (archive) {
		const archivePath = db.resolveArchivePath(typeDef, name);
		if (!archivePath) {
			return task;
		}

		await db.collection.rename({
			from: task.path,
			to: archivePath,
		});
	}

	return task;
}
