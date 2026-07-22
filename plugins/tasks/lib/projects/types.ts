import { basename, extname } from "node:path";
import type { ExtendedTaskNotesTask } from "@/lib/providers/mdbase/tasknotes";
import type {
	FieldDefinition,
	QueryResult,
	QueryResultGroup,
	ReadResult,
} from "@/lib/providers/mdbase/types";
import type { Group } from "@/lib/utils/group";
import type { DeepKeys } from "@/lib/utils/object";

import { generateProjectId } from "./generate-project-id";

export type ProjectType = {
	id?: string;
	status?: string;
	description?: string;
	areas?: string[];
	aliases?: string[];
	color?: string;
	icon?: string;
	banner?: string;
};

export type Project = {
	path: string;
	name: string;
	id: string;
};

export type ProjectFields = DeepKeys<Project>;

export function fromMDBaseProject(
	fieldDefs: Record<
		keyof ExtendedTaskNotesTask,
		{
			key: string;
			field: FieldDefinition;
		}
	>,
	task: Record<string, unknown>,
	path?: string,
): Project {
	return {
		id: task[fieldDefs.id.key] as string,
		path: path ?? ("" as string),
		name:
			(task[fieldDefs.title.key] as string) ??
			((path ? basename(path, extname(path)) : "") as string),
	};
}

export function fromMDBaseProjectResult(
	fieldDefs: Record<
		keyof ExtendedTaskNotesTask,
		{
			key: string;
			field: FieldDefinition;
		}
	>,
	task:
		| QueryResult<Record<string, unknown>>
		| ReadResult<Record<string, unknown>>,
): Project {
	const path = "path" in task ? task.path : task.file.path;
	return fromMDBaseProject(fieldDefs, task, path as string);
}

export function fromMDBaseProjectResultGroup(
	fieldDefs: Record<
		keyof ExtendedTaskNotesTask,
		{
			key: string;
			field: FieldDefinition;
		}
	>,
	group: QueryResultGroup<Record<string, unknown>>,
): Group<Project> {
	return {
		key: group.key,
		items: group.results.map((r) => fromMDBaseProjectResult(fieldDefs, r)),
	};
}

/**
 * @deprecated use fromMDBaseProjectResult instead
 */
export function toProject(
	project: QueryResult<ProjectType> | ReadResult<ProjectType>,
): Project {
	const path = "path" in project ? project.path : project.file.path;
	const name = basename(path, extname(path));
	return {
		path,
		name,
		id: project.id ?? generateProjectId(name),
	};
}

/**
 * @deprecated use fromMDBaseProjectResultGroup instead
 */
export function toProjectGroup(
	group: QueryResultGroup<ProjectType>,
): Group<Project> {
	return {
		key: group.key,
		items: group.results.map(toProject),
	};
}
