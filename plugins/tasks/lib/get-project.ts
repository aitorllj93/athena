import type { Mdbase } from "@/lib/providers/mdbase";

import {
  type Project,
  type ReadResult,
  toProject
} from "./types";

type GetProjectParams = {
	projectName: string;
};
export async function getProject(
	db: Mdbase,
	params: GetProjectParams,
): Promise<Project> {
	const typeDef = await db.getType("project");

	const path = db.resolvePath(typeDef, params.projectName);

	const result = await db.collection.read(path);

	if (result.error) {
		throw new Error(`Could not find project named "${params.projectName}"`);
	}

	return toProject(result as ReadResult);
}
