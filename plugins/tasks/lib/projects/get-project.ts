import type { Mdbase, QueryResult } from "@/lib/providers/mdbase";
import { strEquals, union } from "@/lib/providers/mdbase/queries";
import {
	getTaskNotesFields,
	hasTitle,
	TASKNOTES_TYPES,
} from "@/lib/providers/mdbase/tasknotes";
import { fromMDBaseProjectResult, type Project } from "./types";

type GetProjectParams = {
	projectName: string;
};
export async function getProject(
	db: Mdbase,
	params: GetProjectParams,
): Promise<Project> {
	const typeDef = await db.getType(TASKNOTES_TYPES.PROJECT);
	const fields = getTaskNotesFields(typeDef);
	const path = db.resolvePath(typeDef, fields, params.projectName);

	const found = await db.collection.query({
		types: [TASKNOTES_TYPES.PROJECT],
		where: union([
			strEquals(fields.id.key, `"${params.projectName}"`),
			hasTitle(params.projectName, fields),
			strEquals("file.path", `"${path}"`),
			// strEquals("file.basename", `"${params.projectName}"`),
		]),
	});

	if (found.error) {
		throw new Error(found.error.message);
	}

	const existing = found.results?.[0];

	if (!existing) {
		throw new Error(`Project with name or id "${params.projectName}" not found`);
	}

	return fromMDBaseProjectResult(fields, existing as QueryResult);
}
