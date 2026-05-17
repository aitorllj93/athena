import ms from "ms";

import { memo } from "@/lib/cache";
import { getTranslations } from "@/lib/i18n";
import { today } from "@/lib/utils/date";
import type { GroupByParams } from "@/lib/utils/group";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";
import { formatTasks, formatTasksGroups, listScheduledTasks, type TaskFields } from "../lib";

// biome-ignore lint/suspicious/noExplicitAny: i18n translation function
let translator: any = null;
async function getT() {
	if (translator) return translator;
	const { t } = await getTranslations("tasks");
	translator = t;
	return t;
}

const CACHE_TTL = ms("1s");
const CACHE_KEY = "listScheduledTasksCommand";

type ListScheduledTasksCommandArgs = {
	date?: Date;
	fields?: TaskFields[];
	format?: Format;
	groupBy?: GroupByParams;
	pagination?: PaginationParams;
};
export const listScheduledTasksCommand = memo(
	async function listScheduledTasksCommand({
		date = today(),
		fields = ["name", "timeEstimate", "priority"],
		format = "md",
		groupBy,
		pagination,
	}: ListScheduledTasksCommandArgs = {}): Promise<string> {
		let out = "";

		const t = await getT();

		const { data, groups, page } = await listScheduledTasks({
			date,
			pagination,
			groupBy,
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
