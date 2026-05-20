import type { Mdbase } from "@/lib/providers/mdbase";
import { TASK } from "./constants";
import { lookupTask } from "./lookup-task";

type CompleteTaskParams = {
	name: string;
};
export async function archiveTask(db: Mdbase, { name }: CompleteTaskParams) {
	const typeDef = await db.getType(TASK);
	const path = db.resolvePath(typeDef, name);
	const archivePath = db.resolveArchivePath(typeDef, name);
	if (!archivePath) {
		return;
	}

	const task = await lookupTask(db, { taskNameOrId: name });

	if (task.tags?.includes("archive")) {
		console.log(`Task "${name}" is already archived.`);
		return;
	}

	await db.collection.update({
		path: task.path,
		fields: {
			tags: [
				...task.tags ?? [],
				"archive"
			]
		}
	});

	await db.collection.rename({
		from: path,
		to: archivePath,
	});

	return task;
}
