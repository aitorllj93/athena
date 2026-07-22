import type { Mdbase, QueryResult } from "@/lib/providers/mdbase";
import { strEquals, union } from "@/lib/providers/mdbase/queries";
import {
	getTaskNotesFields,
	hasTitle,
	TASKNOTES_TYPES,
} from "@/lib/providers/mdbase/tasknotes";
import { fromTaskNoteResult, type Task } from "./types";

type LookUpTaskParams = {
	taskNameOrId: string;
};
export async function lookupTask(
	db: Mdbase,
	{ taskNameOrId }: LookUpTaskParams,
): Promise<Task> {
	const typeDef = await db.getType(TASKNOTES_TYPES.TASK);
	const fields = getTaskNotesFields(typeDef);

	const found = await db.collection.query({
		types: [TASKNOTES_TYPES.TASK],
		where: union([
			strEquals(fields.id.key, `"${taskNameOrId}"`),
			hasTitle(taskNameOrId, fields),
			strEquals("file.basename", `"${taskNameOrId}"`),
		]),
	});

	if (found.error) {
		throw new Error(found.error.message);
	}

	const existing = found.results?.[0];

	if (!existing) {
		throw new Error(`Task with name or id "${taskNameOrId}" not found`);
	}

	return fromTaskNoteResult(fields, existing as QueryResult);
}
