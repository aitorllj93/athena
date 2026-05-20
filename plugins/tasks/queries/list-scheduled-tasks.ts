import ms from "ms";

import { memo } from "@/lib/cache";
import { getTranslations } from "@/lib/i18n";
import { Mdbase } from "@/lib/providers/mdbase";
import type { TaskNotesFieldFilters } from "@/lib/providers/mdbase/tasknotes";
import { formatISODate, today } from "@/lib/utils/date";
import type { GroupByParams } from "@/lib/utils/group";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";
import {
	formatTasks,
	formatTasksGroups,
	MDBASE_COLLECTION_ROOT,
	type TaskFields,
} from "../lib";
import { listTasks } from "../lib/list-tasks";

const CACHE_TTL = ms("2h");
const CACHE_KEY = "listScheduledTasksQuery";

type ListScheduledTasksQueryArgs = {
	date?: Date;
	filters?: TaskNotesFieldFilters;
	fields?: TaskFields[];
	format?: Format;
	groupBy?: GroupByParams;
	pagination?: PaginationParams;
};
export const listScheduledTasksQuery = memo(
	async function listScheduledTasksQuery({
		date = today(),
		fields = ["name", "timeEstimate", "priority"],
		filters,
		format = "md",
		groupBy,
		pagination,
	}: ListScheduledTasksQueryArgs = {}): Promise<string> {
		let out = "";

		await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);
		const { t } = await getTranslations("tasks");

		const referenceDate = formatISODate(date);

		const { data, groups, page } = await listTasks(db, {
			filters: {
				isActive: true,
				isDated: referenceDate,
				...filters,
			},
			groupBy,
			pagination,
		});

		out += `${t("unreadCount", { total: page.total })}\n\n`;

		if (groups) {
			out += await formatTasksGroups(groups, format, fields);
		} else if (data) {
			out += await formatTasks(data, format, fields);
		}

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
