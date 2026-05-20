import {
	buildQuery,
	type FilterMap,
	type QueryExpression,
	union,
} from "@/lib/providers/mdbase/queries";
import { TASKNOTES_STATUS } from "../constants";
import type { TaskNotesFieldsMapping } from "../types";
import {
	belongsToProject,
	hasAnyProject,
	hasContext,
	hasNoStatus,
	hasStatus,
	isArchived,
	isDue,
	isDuePast,
	isScheduled,
	isScheduledPast,
} from "./fields";

/** Filters for the fields themselves */
type TaskNotesBaseFieldFilters = {
	archived?: boolean;
	contexts?: string | string[];
	projects?: string | string[];
	scheduled?: string;
	due?: string;
	status?: string | string[];
};

export type TaskNotesFieldFilters = TaskNotesBaseFieldFilters & {
	/** Checks that status is not done or wont-do */
	isActive?: boolean;
	/** Checks whether this task is scheduled or due to date */
	isDated?: string;
	/** Checks whether this task is scheduled or due before date */
	isPast?: string;
	hasAnyProject?: boolean;
	/** Include additional custom expressions */
	expressions?: QueryExpression | QueryExpression[];
};

type BuildTaskNotesQueryArgs = {
	filters: TaskNotesFieldFilters | TaskNotesFieldFilters[];
	fields: TaskNotesFieldsMapping;
};

const builders = new Map<
	keyof TaskNotesFieldFilters,
	FilterMap<
		TaskNotesFieldFilters,
		TaskNotesFieldsMapping
	>[keyof TaskNotesFieldFilters]
>([
	[
		"archived",
		{
			key: "archived",
			build: isArchived,
		},
	],
	[
		"contexts",
		{
			key: "contexts",
			build: hasContext,
		},
	],
	[
		"due",
		{
			key: "due",
			build: isDue,
		},
	],
	[
		"expressions",
		{
			key: "expressions",
			build(v) {
				return v;
			},
		},
	],
	[
		"hasAnyProject",
		{
			key: "hasAnyProject",
			build: hasAnyProject,
		}
	],
	[
		"isActive",
		{
			key: "isActive",
			build(v, fields) {
				const inactiveStatuses = [
					TASKNOTES_STATUS.DONE,
					TASKNOTES_STATUS.WONT_DO,
				];

				return v
					? hasNoStatus(inactiveStatuses, fields)
					: hasStatus(inactiveStatuses, fields);
			},
		},
	],
	[
		"isDated",
		{
			key: "isDated",
			build(v, fields) {
				return union([isScheduled(v, fields), isDue(v, fields)]);
			},
		},
	],
	[
		"isPast",
		{
			key: "isPast",
			build(v, fields) {
				return union([isScheduledPast(v, fields), isDuePast(v, fields)]);
			},
		},
	],
	[
		"projects",
		{
			key: "projects",
			build: belongsToProject,
		},
	],
	[
		"scheduled",
		{
			key: "scheduled",
			build: isScheduled,
		},
	],
	[
		"status",
		{
			key: "status",
			build: hasStatus,
		},
	],
]);

export function buildTaskNotesQuery({
	filters,
	fields,
}: BuildTaskNotesQueryArgs): QueryExpression {
	return buildQuery<TaskNotesFieldFilters, TaskNotesFieldsMapping>({
		filters,
		builders,
		context: fields,
	});
}

export default {
	buildQuery,
};
