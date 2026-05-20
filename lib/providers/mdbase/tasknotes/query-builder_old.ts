import type { FieldDefinition } from "@/lib/providers/mdbase";

import {
	arrContains,
	dateEquals,
	intersection,
	normalizeQueryValue,
	type QueryExpression,
	strEquals,
	union,
} from "@/lib/providers/mdbase/queries";
import { TASKNOTES_TAGS } from "./constants";
import type { TaskNotesFieldRole, TaskNotesFieldsMapping } from "./types";

export const hasStatus = (
	value: string | string[],
	{ status }: TaskNotesFieldsMapping,
): QueryExpression => {
	const values = Array.isArray(value) ? value : [value];

	return union(
		values.map((s) =>
			strEquals(status.key, normalizeQueryValue(s, status.field)),
		),
	);
};

export const isArchived = ({ tags }: TaskNotesFieldsMapping): QueryExpression =>
	arrContains(
		tags.key,
		normalizeQueryValue(TASKNOTES_TAGS.ARCHIVE, tags.field),
	);

export const isScheduled = (
	value: string,
	{ scheduled }: TaskNotesFieldsMapping,
): QueryExpression =>
	dateEquals(scheduled.key, normalizeQueryValue(value, scheduled.field));

export const isDue = (
	value: string,
	{ due }: TaskNotesFieldsMapping,
): QueryExpression =>
	dateEquals(due.key, normalizeQueryValue(value, due.field));

export const hasContext = (
	value: string | string[],
	{ contexts }: TaskNotesFieldsMapping,
): QueryExpression => {
	const values = Array.isArray(value) ? value : [value];

	return union(
		values.map((c) =>
			arrContains(contexts.key, normalizeQueryValue(`@${c}`, contexts.field)),
		),
	);
};

export const belongsToProject = (
	value: string | string[],
	{ projects }: TaskNotesFieldsMapping,
): QueryExpression => {
	const values = Array.isArray(value) ? value : [value];

	return union(
		values.map((p) =>
			arrContains(projects.key, normalizeQueryValue(p, projects.field)),
		),
	);
};

/** Filters for the fields themselves */
type TaskNotesBaseFieldFilters = {
	contexts?: string | string[];
	projects?: string | string[];
	scheduled?: string;
	due?: string;
	status?: string | string[];
};

export type TaskNotesFieldFilters = TaskNotesBaseFieldFilters & {
	/** Include additional custom expressions */
	expressions?: QueryExpression | QueryExpression[];
};

type BuildTaskNotesQueryArgs = {
	filters: TaskNotesFieldFilters;
	fields: Record<TaskNotesFieldRole, { key: string; field: FieldDefinition }>;
};

export function buildQuery({
	filters,
	fields,
}: BuildTaskNotesQueryArgs): QueryExpression {
	if (Object.keys(filters).length === 0) {
		return {};
	}

	const expressions: QueryExpression[] = [];

	if (filters.status) {
		expressions.push(hasStatus(filters.status, fields));
	}

	if (filters.contexts && filters.contexts.length > 0) {
		expressions.push(hasContext(filters.contexts, fields));
	}

	if (filters.projects && filters.projects.length > 0) {
		expressions.push(belongsToProject(filters.projects, fields));
	}

	if (filters.expressions) {
		expressions.push(
			...(Array.isArray(filters.expressions)
				? filters.expressions
				: [filters.expressions]),
		);
	}

	return intersection(expressions);
}

export default {
	buildQuery,
};
