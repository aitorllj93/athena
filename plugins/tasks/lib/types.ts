import { basename, extname } from "node:path";
import type {
	ExtendedTaskNotesTask,
	TaskNotesTask,
	TaskNotesTaskStatus,
} from "@/lib/providers/mdbase/tasknotes";
import type { FieldDefinition, QueryResult, QueryResultGroup, ReadResult } from "@/lib/providers/mdbase/types";
import type { Group } from "@/lib/utils/group";
import type { DeepKeys } from "@/lib/utils/object";
import { generateProjectId } from "./generate-project-id";

export type TaskType = TaskNotesTask & {
	id?: string;
	status?: TaskNotesTaskStatus;
	/**
	 * @deprecated use contexts instead
	 */
	block?: string;
};

export type TaskBlocker = {
	uid: string;
	reltype: "FINISHTOSTART";
	gap?: string;
};

export type TaskStatus =
	| "open"
	| "in-progress"
	| "done"
	| "wont-do"
	| "blocked";

export type TaskTimeEntry = {
	startTime?: string;
	endTime?: string;
	description?: string;
	duration?: number;
};

export type Task = {
	id?: string;
	path: string;
	name: string;
	status: TaskStatus;
	projects?: string[];
	priority?: string;
	timeEntries?: TaskTimeEntry[];
	timeEstimate?: number;
	blockedBy?: TaskBlocker[];
	contexts?: string[];
	/**
	 * @deprecated use contexts instead
	 */
	block?: string;
	tags?: string[];
};

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

export type TaskFields = DeepKeys<Task>;
export type ProjectFields = DeepKeys<Project>;

// TODO: Remove this
function mapStatusValue(value?: string): TaskStatus {
	if (value === "Completada") {
		return "done";
	}
	
	if (value === "En Progreso") {
		return "in-progress";
	}

	return "open";
}

export function fromTaskNote(
	fieldDefs: Record<
		keyof ExtendedTaskNotesTask,
		{
			key: string;
			field: FieldDefinition;
		}
	>,
	task: Record<string, unknown>,
	path?: string,
): Task {
	return {
		id: task[fieldDefs.id.key] as string,
		path: path ?? "" as string,
		name: task[fieldDefs.title.key] as string ?? (path ? basename(path, extname(path)) : "") as string,
		status: mapStatusValue(task[fieldDefs.status.key] as string ?? fieldDefs.status.field.default),
		projects: task[fieldDefs.projects.key] as string[],
		priority: task[fieldDefs.priority.key] as string,
		timeEntries: task[fieldDefs.timeEntries.key] as TaskTimeEntry[],
		timeEstimate: task[fieldDefs.timeEstimate.key] as number,
		blockedBy: task[fieldDefs.blockedBy.key] as TaskBlocker[],
		contexts: task[fieldDefs.contexts.key] as string[],
		tags: task[fieldDefs.tags.key] as string[],
	};
}

export function fromTaskNoteResult(
	fieldDefs: Record<
		keyof ExtendedTaskNotesTask,
		{
			key: string;
			field: FieldDefinition;
		}
	>,
	task: QueryResult<Record<string, unknown>> | ReadResult<Record<string, unknown>>,
): Task {
	const path = "path" in task ? task.path : task.file.path;
	return fromTaskNote(fieldDefs, task, path as string);
}

export function fromTaskNoteResultGroup(
	fieldDefs: Record<
		keyof ExtendedTaskNotesTask,
		{
			key: string;
			field: FieldDefinition;
		}
	>,
	group: QueryResultGroup<Record<string, unknown>>,
): Group<Task> {
	return {
		key: group.key,
		items: group.results.map(r => fromTaskNoteResult(fieldDefs, r)),
	};
}

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
		path: path ?? "" as string,
		name: task[fieldDefs.title.key] as string ?? (path ? basename(path, extname(path)) : "") as string,
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
	task: QueryResult<Record<string, unknown>> | ReadResult<Record<string, unknown>>,
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
		items: group.results.map(r => fromMDBaseProjectResult(fieldDefs, r)),
	};
}

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

export function toProjectGroup(
	group: QueryResultGroup<ProjectType>,
): Group<Project> {
	return {
		key: group.key,
		items: group.results.map(toProject),
	};
}
