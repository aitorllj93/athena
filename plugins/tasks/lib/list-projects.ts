import type { Mdbase } from "@/lib/providers/mdbase";
import type { Group, GroupByParams } from "@/lib/utils/group";
import type { Pagination, PaginationParams } from "@/lib/utils/pagination";

import {
  type Project,
  type QueryResult,
  type QueryResultGroup,
  toProject,
  toProjectGroup
} from "./types";

const DEFAULT_LIMIT = 50;

type ListProjectsParams = {
	groupBy?: GroupByParams;
	pagination?: PaginationParams;
};
export async function listProjects(
	db: Mdbase,
	params: ListProjectsParams = {},
): Promise<{
	data?: Project[];
	groups?: Group<Project>[];
	page: Pagination;
}> {
	const page = params.pagination?.page ?? 1;
	const limit = params.pagination?.limit ?? DEFAULT_LIMIT;
	const offset = (page - 1) * limit;

	const query = await db.collection.query({
		group_by: params.groupBy,
		types: ["project"],
		limit,
		offset,
		where: {},
	});

	const data = ((query.results as QueryResult[]) ?? [])?.map(toProject);
	const groups = (query.groups as QueryResultGroup[])?.map(toProjectGroup);

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
