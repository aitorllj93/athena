import type { Pagination, PaginationParams } from "@/lib/utils/pagination";

import { DisposableCollection } from "./collection";
import { type QueryResultTask, type Task, toTask } from "./types";

type ListScheduledTasksParams = {
	pagination?: PaginationParams;
	date: Date;
};
export async function listScheduledTasks(
	params: ListScheduledTasksParams
): Promise<{
	data: Task[];
	page: Pagination;
}> {
  const page = params.pagination?.page ?? 1;
	const limit =  params.pagination?.limit ?? 10;
  const offset = (page - 1) * limit;

	await using db = await DisposableCollection.open();

	const query = await db.collection.query({
		types: ["task"],
		limit,
		offset,
		where: `status == "open"`,
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
		}
	}
}
