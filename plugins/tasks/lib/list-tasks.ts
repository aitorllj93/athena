import type { Mdbase } from "@/lib/providers/mdbase";
import {
	buildTaskNotesQuery,
	getTaskNotesFields,
	TASKNOTES_TYPES,
	type TaskNotesFieldFilters,
} from "@/lib/providers/mdbase/tasknotes";
import type { Group, GroupByParams } from "@/lib/utils/group";
import type { Pagination, PaginationParams } from "@/lib/utils/pagination";

import {
	type QueryResult,
	type QueryResultGroup,
	type Task,
	toTask,
	toTaskGroup,
} from "./types";

const DEFAULT_LIMIT = 50;

type OrderByParams = {
	field: string;
	direction: "desc" | "asc";
};

type ListTasksParams = {
	filters?: TaskNotesFieldFilters;
	groupBy?: GroupByParams;
	orderBy?: OrderByParams | OrderByParams[];
	pagination?: PaginationParams;
};
export async function listTasks(
	db: Mdbase,
	{
		filters = {
			isActive: true,
		},
		groupBy,
		orderBy,
		pagination,
	}: ListTasksParams = {},
): Promise<{
	data?: Task[];
	groups?: Group<Task>[];
	page: Pagination;
}> {
	const page = pagination?.page ?? 1;
	const limit = pagination?.limit ?? DEFAULT_LIMIT;
	const offset = (page - 1) * limit;

	const typeDef = await db.getType(TASKNOTES_TYPES.TASK);
	const fields = getTaskNotesFields(typeDef);

	const where = buildTaskNotesQuery({
		fields,
		filters,
	});

	const query = await db.collection.query({
		group_by: groupBy,
		types: [TASKNOTES_TYPES.TASK],
		limit,
		offset,
		where,
		order_by: orderBy
			? Array.isArray(orderBy)
				? orderBy
				: [orderBy]
			: undefined,
	});

	const data = ((query.results as QueryResult[]) ?? [])?.map(toTask);
	const groups = (query.groups as QueryResultGroup[])?.map(toTaskGroup);

	const total = query.meta?.total_count ?? data.length;

	return {
		data,
		groups,
		page: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
			hasMore: query.meta?.has_more ?? offset + limit < total,
		},
	};
}
