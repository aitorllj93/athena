import { basename, extname } from "node:path";
import type {
	ExtendedTaskNotesTask,
	TaskNotesTask,
	TaskNotesTaskStatus,
} from "@/lib/providers/mdbase/tasknotes";
import type {
	FieldDefinition,
	QueryResult,
	QueryResultGroup,
	ReadResult,
} from "@/lib/providers/mdbase/types";
import type { Group } from "@/lib/utils/group";
import type { DeepKeys } from "@/lib/utils/object";

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

export type TaskFields = DeepKeys<Task>;


// TODO: Remove this
const STATUS_MAP: Record<TaskNotesTaskStatus, string> = {
	done: "Completada",
	"wont-do": "No se Hará",
	blocked: "Bloqueada",
	"in-progress": "En Progreso",
	open: "Abierta"
};

export function toTaskNoteStatus(value: TaskNotesTaskStatus): string  {
	return STATUS_MAP[value];
}

// TODO: Remove this
function fromTaskNoteStatus(value?: string): TaskStatus {
	return Object.entries(STATUS_MAP).find(e => e[1] === value)?.[0] as TaskStatus ?? "open";
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
		path: path ?? ("" as string),
		name:
			(task[fieldDefs.title.key] as string) ??
			((path ? basename(path, extname(path)) : "") as string),
		status: fromTaskNoteStatus(
			(task[fieldDefs.status.key] as string) ?? fieldDefs.status.field.default,
		),
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
	task:
		| QueryResult<Record<string, unknown>>
		| ReadResult<Record<string, unknown>>,
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
		items: group.results.map((r) => fromTaskNoteResult(fieldDefs, r)),
	};
}
