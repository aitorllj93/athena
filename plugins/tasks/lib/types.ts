import { basename, extname } from "node:path";
import type { Group } from "@/lib/utils/group";
import type { DeepKeys } from "@/lib/utils/object";
import { generateProjectId } from "./generate-project-id";

export type QueryResult<T extends Record<string, unknown> = Record<string, unknown>> = {
	path: string;
	type: string;
	frontmatter?: Record<string, unknown>;
	types: string[];
	body?: string | null;
} & T;

export type ReadResult<T extends Record<string, unknown> = Record<string, unknown>> = {
	file: {
		path: string;
	};
	frontmatter?: Record<string, unknown>;
	types: string[];
	body?: string | null;
} & T;

export type QueryResultGroup<T extends Record<string, unknown> = Record<string, unknown>> = {
	key: string;
	results: QueryResult<T>[];
};

export type TaskStatus = "open" | "done";

export type TaskType = {
	id?: string;
	status?: TaskStatus;
	projects?: string[];
	priority?: string;
	timeEstimate?: number;
	dateCreated?: string;
	dateModified?: string;
	blockedBy?: {
		uid: string;
		reltype: "FINISHTOSTART";
	}[];
	contexts?: string[];
	block?: string;
	recurrence_anchor?: string;
	tags?: string[];
};

export type Task = {
	id?: string;
	path: string;
	name: string;
	status: TaskStatus;
	projects?: string[];
	priority?: string;
	timeEstimate?: number;
	blockedBy?: {
		uid: string;
		reltype: "FINISHTOSTART";
	}[];
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
}

export type TaskFields = DeepKeys<Task>;
export type ProjectFields = DeepKeys<Project>;

export function toTask(task: QueryResult<TaskType> | ReadResult<TaskType>): Task {
	const path = 'path' in task ? task.path : task.file.path;
	return {
		id: task.id,
		path,
		name: basename(path, extname(path)),
		status: task.status ?? "open",
		projects: task.projects,
		priority: task.priority,
		timeEstimate: task.timeEstimate,
		blockedBy: task.blockedBy,
		block: task.block,
		contexts: task.contexts,
		tags: task.tags,
	};
}

export function toTaskGroup(
	group: QueryResultGroup<TaskType>,
): Group<Task> {
	return {
		key: group.key,
		items: group.results.map(toTask),
	};
}


export function toProject(project: QueryResult<ProjectType> | ReadResult<ProjectType>): Project {
	const path = 'path' in project ? project.path : project.file.path;
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