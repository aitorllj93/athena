import ms from "ms";
import { memo } from "@/lib/cache";
import {
	createClient,
	formatEvent,
	formatGroup,
	listUpcomingEvents,
} from "@/lib/calendar";
import { getOAuthClient } from "@/lib/providers/google/auth";
import { groupBy } from "@/lib/utils/group";
import type { PaginationParams } from "@/lib/utils/pagination";

type ListUpcomingEventsCommandArgs = {
	pagination?: PaginationParams;
};

export const listUpcomingEventsCommand = memo(
	async function listUpcomingEventsCommand({
		pagination,
	}: ListUpcomingEventsCommandArgs = {}): Promise<string> {
		let out = "";

		const auth = getOAuthClient();

		const calendarClient = createClient(auth);

		const { data } = await listUpcomingEvents(calendarClient, {
			pagination,
		});

		const grouped = groupBy(
			data,
			(event) => {
				const start = event.start?.dateTime ?? event.start?.date;

				if (!start) {
					return "unknown";
				}

				return start.slice(0, 10);
			},
			{
				sortGroups: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
			},
		);

		for (const group of grouped) {
			out += `${formatGroup(group.key)}\n`;
			for (const event of group.items) {
				out += `${formatEvent(event)}\n`;
			}
			out += "\n";
		}

		return out;
	},
	ms("2h"),
);
