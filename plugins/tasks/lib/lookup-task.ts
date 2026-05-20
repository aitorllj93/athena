import type { Mdbase } from "@/lib/providers/mdbase";
import { TASK } from "./constants";
import { type ReadResult, toTask } from "./types";

type LookUpTaskParams = {
	taskNameOrId: string;
};
export async function lookupTask(
	db: Mdbase,
	{ taskNameOrId }: LookUpTaskParams,
) {
	const typeDef = await db.getType(TASK);
	const path = db.resolvePath(typeDef, taskNameOrId);

  // TODO: Implement path and ID lookups
	const existing = await db.collection.read(path);

	if (!existing) {
		throw new Error(`Task with name or id "${taskNameOrId}" not found`);
	}

	return toTask(existing as ReadResult);
}
