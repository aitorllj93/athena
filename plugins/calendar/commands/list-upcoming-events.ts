import ms from "ms";

import { memo } from "@/lib/cache";
import { getOAuthClient } from "@/lib/providers/google/auth";
import type { GroupByParams } from "@/lib/utils/group";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";
import {
	type CalendarEventFields,
	createClient,
	formatCalendarEvents,
	formatCalendarEventsGroups,
	listUpcomingEvents,
} from "../lib";

const CACHE_TTL = ms("2h");
const CACHE_KEY = "listUpcomingEventsCommand";

type ListUpcomingEventsCommandArgs = {
	fields?: CalendarEventFields[];
	format?: Format;
	groupBy?: GroupByParams;
	pagination?: PaginationParams;
};
export const listUpcomingEventsCommand = memo(
	async function listUpcomingEventsCommand({
		fields = ["startDate", "startTime", "summary", "id"],
		format = "text",
		groupBy,
		pagination,
	}: ListUpcomingEventsCommandArgs = {}): Promise<string> {
		let out = "";

		const auth = getOAuthClient();

		const calendarClient = createClient(auth);

		const { data, groups } = await listUpcomingEvents(calendarClient, {
			groupBy,
			pagination,
		});

		if (groups) {
			out += await formatCalendarEventsGroups(groups, format, fields);
		} else if (data) {
			out += await formatCalendarEvents(data, format, fields);
		}

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
