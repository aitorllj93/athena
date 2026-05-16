import { orderBy } from "@/lib/utils/order";
import {
	type Pagination,
	type PaginationParams,
	paginate,
} from "@/lib/utils/pagination";

import { listCalendars } from "./list-calendars";
import type { CalendarClient, CalendarEvent } from "./types";

type ListUpcomingParams = {
	pagination?: PaginationParams;
	days?: number;
};
export async function listUpcomingEvents(
	client: CalendarClient,
	params: ListUpcomingParams,
): Promise<{
	data: CalendarEvent[];
	page: Pagination;
}> {
	const days = params.days ?? 7;

	const timeMin = new Date().toISOString();
	const timeMax = new Date(
		Date.now() + days * 24 * 60 * 60 * 1000,
	).toISOString();

	const { data: calendars } = await listCalendars(client);

	const events = (
		await Promise.all(
			calendars.map((calendar) =>
				client.events.list({
					calendarId: calendar.id!,
					timeMin,
					timeMax,
					singleEvents: true,
					orderBy: "startTime",
				}),
			),
		)
	).flatMap((res) => res.data.items ?? []);

	const sorted = orderBy(events, [
		{
			key: "start.dateTime",
			order: "desc",
		},
	]);

	return paginate(sorted ?? [], params.pagination);
}
