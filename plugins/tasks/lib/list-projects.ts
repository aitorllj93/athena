import type { Mdbase } from "@/lib/providers/mdbase";
import {
	intersection,
	type QueryExpression,
} from "@/lib/providers/mdbase/queries";
import {
	getTaskNotesFields,
	TASKNOTES_TYPES,
} from "@/lib/providers/mdbase/tasknotes";
import type { Group, GroupByParams } from "@/lib/utils/group";
import type { Pagination, PaginationParams } from "@/lib/utils/pagination";
import {
	fromMDBaseProjectResult,
	fromMDBaseProjectResultGroup,
	type Project,
	type QueryResult,
	type QueryResultGroup,
} from "./types";

const DEFAULT_LIMIT = 50;

export type ProjectsFieldFilters = {
	/** Include additional custom expressions */
	expressions?: QueryExpression | QueryExpression[];
};

type OrderByParams = {
	field: string;
	direction: "desc" | "asc";
};

type ListProjectsParams = {
	filters?: ProjectsFieldFilters;
	groupBy?: GroupByParams;
	orderBy?: OrderByParams | OrderByParams[];
	pagination?: PaginationParams;
};
export async function listProjects(
	db: Mdbase,
	{ filters, groupBy, orderBy, pagination }: ListProjectsParams = {},
): Promise<{
	data?: Project[];
	groups?: Group<Project>[];
	page: Pagination;
}> {
	const page = pagination?.page ?? 1;
	const limit = pagination?.limit ?? DEFAULT_LIMIT;
	const offset = (page - 1) * limit;

	const typeDef = await db.getType(TASKNOTES_TYPES.PROJECT);
	const fields = getTaskNotesFields(typeDef);

	const query = await db.collection.query({
		group_by: groupBy,
		types: [TASKNOTES_TYPES.PROJECT],
		limit,
		offset,
		where: Array.isArray(filters?.expressions)
			? intersection(filters?.expressions)
			: (filters?.expressions ?? {}),
		order_by: orderBy
			? Array.isArray(orderBy)
				? orderBy
				: [orderBy]
			: undefined,
	});

	const data = ((query.results as QueryResult[]) ?? [])?.map(p => fromMDBaseProjectResult(fields, p));
	const groups = (query.groups as QueryResultGroup[])?.map(g => fromMDBaseProjectResultGroup(fields, g));

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
