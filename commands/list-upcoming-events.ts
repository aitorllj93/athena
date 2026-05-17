import ms from "ms";

import { memo } from "@/lib/cache";
import {
	type CalendarEventFields,
	createClient,
	formatCalendarEvents,
	formatCalendarEventsGroup,
	listUpcomingEvents,
} from "@/lib/calendar";
import { getOAuthClient } from "@/lib/providers/google/auth";
import { formatRelative } from "@/lib/utils/date";
import { groupBy } from "@/lib/utils/group";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";

type ListUpcomingEventsCommandArgs = {
	fields?: CalendarEventFields[];
	format?: Format;
	pagination?: PaginationParams;
};
export const listUpcomingEventsCommand = memo(
	async function listUpcomingEventsCommand({
		fields = ["startTime", "summary", "id"],
		format = "text",
		pagination,
	}: ListUpcomingEventsCommandArgs = {}): Promise<string> {
		let out = "";

		const auth = getOAuthClient();

		const calendarClient = createClient(auth);

		const { data } = await listUpcomingEvents(calendarClient, {
			pagination,
		});

		if (format === "json") {
			return formatCalendarEvents(data, format, fields);
		}

		const grouped = groupBy(
			data,
			(event) => {
				const start = event.startDate ?? event.endDate;

				if (!start) {
					return "unknown";
				}

				return start.toISOString().slice(0, 10);
			},
			{
				sortGroups: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
			},
		);

		for (const group of grouped) {
			out += formatCalendarEventsGroup(
				formatRelative(new Date(group.key)),
				group.items,
				format,
				fields,
			);
			out += "\n\n";
		}

		return out;
	},
	ms("2h"),
);
