import type { Mdbase } from "@/lib/providers/mdbase";
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
	const task = await lookupTask(db, { taskNameOrId: name });

	const typeDef = await db.getType("task");
	const path = db.resolvePath(typeDef, name);

	if (task.status === "done") {
		console.log(`Task "${name}" is already completed.`);
		return task;
	}

	await db.collection.update({
		path,
		fields: {
			status: "done",
			tags: [...(task.tags ?? []), ...(archive ? ["archive"] : [])],
		},
	});

	if (archive) {
		const archivePath = db.resolveArchivePath(typeDef, name);
		if (!archivePath) {
			return task;
		}

		await db.collection.rename({
			from: path,
			to: archivePath,
		});
	}

	return task;
}
