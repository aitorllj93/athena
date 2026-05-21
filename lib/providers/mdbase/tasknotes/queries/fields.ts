import {
	arrContains,
	dateEquals,
	dateLower,
	intersection,
	negation,
	normalizeQueryValue,
	type QueryExpression,
	strDiffers,
	strEquals,
	union,
} from "@/lib/providers/mdbase/queries";
import { TASKNOTES_TAGS } from "../constants";
import type { TaskNotesFieldsMapping } from "../types";

export const hasTitle = (
	value: string,
	{ status }: TaskNotesFieldsMapping,
): QueryExpression => {
	return strEquals(status.key, normalizeQueryValue(value, status.field));
};

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

export const hasNoStatus = (
	value: string | string[],
	{ status }: TaskNotesFieldsMapping,
): QueryExpression => {
	const values = Array.isArray(value) ? value : [value];

	return intersection(
		values.map((s) =>
			strDiffers(status.key, normalizeQueryValue(s, status.field)),
		),
	);
};

export const isArchived = (
	value: boolean,
	{ tags }: TaskNotesFieldsMapping,
): QueryExpression => {
  const exp = arrContains(
    tags.key,
    normalizeQueryValue(TASKNOTES_TAGS.ARCHIVE, tags.field),
  );

  return value ? exp : negation(exp);
};

export const isScheduled = (
	value: string,
	{ scheduled }: TaskNotesFieldsMapping,
): QueryExpression =>
	dateEquals(scheduled.key, normalizeQueryValue(value, scheduled.field));

export const isScheduledPast = (
	value: string,
	{ scheduled }: TaskNotesFieldsMapping,
): QueryExpression =>
	dateLower(scheduled.key, normalizeQueryValue(value, scheduled.field));

export const isDue = (
	value: string,
	{ due }: TaskNotesFieldsMapping,
): QueryExpression =>
	dateEquals(due.key, normalizeQueryValue(value, due.field));

export const isDuePast = (
	value: string,
	{ due }: TaskNotesFieldsMapping,
): QueryExpression =>
	dateLower(due.key, normalizeQueryValue(value, due.field));

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

export const hasAnyProject = (
	value: boolean,
	{ projects }: TaskNotesFieldsMapping,
): QueryExpression => {
	return value ?
		projects.key :
		negation(projects.key);
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
