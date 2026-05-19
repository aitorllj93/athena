import type { Mdbase } from "@/lib/providers/mdbase";
import { formatISODate } from "@/lib/utils/date";
import type { GroupByParams } from "@/lib/utils/group";
import type { Pagination, PaginationParams } from "@/lib/utils/pagination";
import { hasStatus, isDue, isScheduled } from "./filters";
import { type QueryResultTask, type Task, toTask } from "./types";

type ListPastTasksParams = {
	groupBy?: GroupByParams;
	pagination?: PaginationParams;
	date: Date;
};
export async function listPastTasks(
	db: Mdbase,
	params: ListPastTasksParams,
): Promise<{
	data: Task[];
	page: Pagination;
}> {
	const referenceDate = formatISODate(params.date);
	const page = params.pagination?.page ?? 1;
	const limit = params.pagination?.limit ?? 10;
	const offset = (page - 1) * limit;

	const query = await db.collection.query({
		group_by: params.groupBy,
		types: ["task"],
		limit,
		offset,
		where: {
			and: [
				hasStatus("open"),
				{
					or: [isScheduled(referenceDate), isDue(referenceDate)],
				},
			],
		},
	});

	const data = ((query.results as QueryResultTask[]) ?? []).map(toTask);
	const total = query.meta?.total_count ?? data.length;

	return {
		data,
		page: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
			hasMore: query.meta?.has_more ?? offset + limit < total,
		},
	};
}
