import type { Mdbase } from "@/lib/providers/mdbase";
import {
	getTaskNotesFields,
	TASKNOTES_TYPES,
} from "@/lib/providers/mdbase/tasknotes";
import { TASK_TAGS } from "./constants";
import { lookupTask } from "./lookup-task";

type ArchiveTaskParams = {
	name: string;
};
export async function archiveTask(db: Mdbase, { name }: ArchiveTaskParams) {
	const typeDef = await db.getType(TASKNOTES_TYPES.TASK);
	const fieldDefs = getTaskNotesFields(typeDef);

	const path = db.resolvePath(typeDef, fieldDefs, name);
	const archivePath = db.resolveArchivePath(typeDef, fieldDefs, name);
	if (!archivePath) {
		return;
	}

	const task = await lookupTask(db, { taskNameOrId: name });

	if (task.tags?.includes(TASK_TAGS.ARCHIVE)) {
		console.log(`Task "${name}" is already archived.`);
		return;
	}

	await db.collection.update({
		path: task.path,
		fields: {
			tags: [...(task.tags ?? []), TASK_TAGS.ARCHIVE],
		},
	});

	await db.collection.rename({
		from: path,
		to: archivePath,
	});

	return task;
}
