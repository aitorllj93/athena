
import type { Mdbase } from "@/lib/providers/mdbase";
import { TASK } from "./constants";
import { type QueryResult, toTask } from "./types";

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

	const existing = await db.collection.query({
		types: ["task"],
		where: `file.path == "${path}"`,
	});

	if (!existing.results || existing.results.length === 0) {
		throw new Error(`Task not found`);
	}

	const task = toTask(existing.results[0] as QueryResult);

	await db.collection.rename({
		from: path,
		to: archivePath,
	});

	return task;
}
