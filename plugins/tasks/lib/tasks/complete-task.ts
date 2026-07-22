import { getTranslations } from "@/lib/i18n";
import type { Mdbase } from "@/lib/providers/mdbase";
import {
	getTaskNotesFields,
	TASKNOTES_TYPES,
} from "@/lib/providers/mdbase/tasknotes";
import { TASK_STATUS, TASK_TAGS } from "./constants";
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

	const typeDef = await db.getType(TASKNOTES_TYPES.TASK);
	const fields = getTaskNotesFields(typeDef);

	if (task.status === TASK_STATUS.DONE) {
		console.log(t("messages.alreadyCompleted", { name }));
		return task;
	}

	const res = await db.collection.update({
		path: task.path,
		fields: {
			[fields.status.key]: TASK_STATUS.DONE,
			[fields.tags.key]: [
				...(task.tags ?? []),
				...(archive ? [TASK_TAGS.ARCHIVE] : []),
			],
		},
	});

	if (res.error) {
		throw new Error(res.error.message);
	}

	if (archive) {
		const archivePath = db.resolveArchivePath(typeDef, fields, name);
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
