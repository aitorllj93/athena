import type { Mdbase } from "@/lib/providers/mdbase";
import { strEquals, union } from "@/lib/providers/mdbase/queries";
import {
	getTaskNotesFields,
	TASKNOTES_TYPES,
} from "@/lib/providers/mdbase/tasknotes";
import { fromMDBaseProjectResult, type Project, type QueryResult } from "./types";

type GetProjectParams = {
	projectName: string;
};
export async function getProject(
	db: Mdbase,
	params: GetProjectParams,
): Promise<Project> {
	const typeDef = await db.getType(TASKNOTES_TYPES.PROJECT);

	const fieldDefs = getTaskNotesFields(typeDef);
	const path = db.resolvePath(typeDef, fieldDefs, params.projectName);

	const projects = await db.collection.query({
		types: [TASKNOTES_TYPES.PROJECT],
		where: union([
			strEquals("file.path", `"${path}"`),
			// strEquals("file.basename", `"${params.projectName}"`),
			strEquals(fieldDefs.id.key, `"${params.projectName}"`),
		]),
	});

	if (!projects.results || projects.results?.length <= 0) {
		throw new Error(`Could not find project named "${params.projectName}"`);
	}

	return fromMDBaseProjectResult(fieldDefs, projects.results[0] as QueryResult);
}
