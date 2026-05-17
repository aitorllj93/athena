import { basename, extname } from "node:path";
import type { Group } from "@/lib/utils/group";
import type { DeepKeys } from "@/lib/utils/object";

export type QueryResultTask = {
	path: string;
	type: string;
	status: "open";
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
	frontmatter?: Record<string, unknown>;
	types: string[];
	body?: string | null;
};

export type QueryResultGroup<T = Record<string, unknown>> = {
	key: string;
	results: T[];
};

export type Task = {
	name: string;
	status: "open";
	projects?: string[];
	priority?: string;
	timeEstimate?: number;
	blockedBy?: {
		uid: string;
		reltype: "FINISHTOSTART";
	}[];
	block?: string;
};
export type TaskFields = DeepKeys<Task>;

export function toTaskGroup(
	group: QueryResultGroup<QueryResultTask>,
): Group<Task> {
	return {
		key: group.key,
		items: group.results.map(toTask),
	};
}

export function toTask(task: QueryResultTask): Task {
	return {
		name: basename(task.path, extname(task.path)),
		status: task.status,
		projects: task.projects,
		priority: task.priority,
		timeEstimate: task.timeEstimate,
		blockedBy: task.blockedBy,
		block: task.block,
	};
}
