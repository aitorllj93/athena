import { basename, extname } from "node:path";
import type {
	ExtendedTaskNotesTask,
	TaskNotesTask,
	TaskNotesTaskStatus,
} from "@/lib/providers/mdbase/tasknotes";
import type { FieldDefinition } from "@/lib/providers/mdbase/types";
import type { Group } from "@/lib/utils/group";
import type { DeepKeys } from "@/lib/utils/object";
import { generateProjectId } from "./generate-project-id";

export type QueryResult<
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	path: string;
	type: string;
	frontmatter?: Record<string, unknown>;
	types: string[];
	body?: string | null;
} & T;

export type ReadResult<
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	file: {
		path: string;
	};
	frontmatter?: Record<string, unknown>;
	types: string[];
	body?: string | null;
} & T;

export type QueryResultGroup<
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	key: string;
	results: QueryResult<T>[];
};

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
		status: task[fieldDefs.status.key] as TaskStatus ?? fieldDefs.status.field.default as TaskStatus,
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

export function toTask(
	task: QueryResult<TaskType> | ReadResult<TaskType>,
): Task {
	const path = "path" in task ? task.path : task.file.path;
	return {
		id: task.id,
		path,
		name: basename(path, extname(path)),
		status: task.status ?? "open",
		projects: task.projects,
		priority: task.priority,
		timeEntries: task.timeEntries,
		timeEstimate: task.timeEstimate,
		blockedBy: task.blockedBy,
		block: task.block,
		contexts: task.contexts,
		tags: task.tags,
	};
}

export function toTaskGroup(group: QueryResultGroup<TaskType>): Group<Task> {
	return {
		key: group.key,
		items: group.results.map(toTask),
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
