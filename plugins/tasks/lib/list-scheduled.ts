import type { Mdbase } from "@/lib/providers/mdbase";
import { union } from "@/lib/providers/mdbase/queries";
import {
	getTaskNotesFields,
	isDue,
	isScheduled,
	TASKNOTES_TYPES,
} from "@/lib/providers/mdbase/tasknotes";
import { TASKNOTES_STATUS } from "@/lib/providers/mdbase/tasknotes/constants";
import { formatISODate } from "@/lib/utils/date";
import type { Group, GroupByParams } from "@/lib/utils/group";
import type { Pagination, PaginationParams } from "@/lib/utils/pagination";
import { listTasks } from "./list-tasks";
import type { Task } from "./types";

type TaskFilters = {
	project?: string;
};

type ListScheduledTasksParams = {
	filters?: TaskFilters;
	groupBy?: GroupByParams;
	pagination?: PaginationParams;
	date: Date;
};
export async function listScheduledTasks(
	db: Mdbase,
	{ date, filters, groupBy, pagination }: ListScheduledTasksParams,
): Promise<{
	data?: Task[];
	groups?: Group<Task>[];
	page: Pagination;
}> {
	const referenceDate = formatISODate(date);
	const typeDef = await db.getType(TASKNOTES_TYPES.TASK);
	const fields = getTaskNotesFields(typeDef);

	return listTasks(db, {
		filters: {
			status: TASKNOTES_STATUS.OPEN,
			expressions: [
				union([
					isScheduled(referenceDate, fields),
					isDue(referenceDate, fields),
				]),
			],
			...filters,
		},
		groupBy,
		pagination,
	});
}
