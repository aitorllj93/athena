import ms from "ms";

import { memo } from "@/lib/cache";
import { getTranslations } from "@/lib/i18n";
import { formatTasks, listScheduledTasks, type TaskFields } from "@/lib/tasks";
import { today } from "@/lib/utils/date";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";

const { t } = await getTranslations("tasks");

type ListScheduledTasksCommandArgs = {
	date?: Date;
	fields?: TaskFields[];
	format?: Format;
	pagination?: PaginationParams;
};
export const listScheduledTasksCommand = memo(
	async function listScheduledTasksCommand({
		date = today(),
		fields = ["name", "timeEstimate", "priority"],
		format = "md",
		pagination,
	}: ListScheduledTasksCommandArgs = {}): Promise<string> {
		let out = "";

		const { data, page } = await listScheduledTasks({
			date,
			pagination,
		});

		out += `${t("unreadCount", { total: page.total })}\n\n`;

		out += formatTasks(data, format, fields);

		return out;
	},
	ms("1s"),
);
