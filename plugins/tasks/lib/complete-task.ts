import type { Mdbase } from "@/lib/providers/mdbase";
import { type QueryResult, type Task, toTask } from "./types";

type CompleteTaskParams = {
	name: string;
	archive?: boolean;
};
export async function completeTask(
	db: Mdbase,
	{ archive, name }: CompleteTaskParams,
): Promise<Task> {
	const existing = await db.collection.query({
		types: ["task"],
		where: `file.path == "${name}"`,
	});

	if (!existing.results || existing.results.length === 0) {
		throw new Error(`Task not found`);
	}

	const task = toTask(existing.results[0] as QueryResult);

	const typeDef = await db.getType("task");
	const path = db.resolvePath(typeDef, name);

	await db.collection.update({
		path,
		fields: {
			status: "done",
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
