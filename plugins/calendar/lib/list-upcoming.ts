import ms from "ms";

import { orderBy } from "@/lib/utils/order";
import {
	type Pagination,
	type PaginationParams,
	paginate,
} from "@/lib/utils/pagination";
import { listCalendars } from "./list-calendars";

import {
	type CalendarClient,
	type CalendarEvent,
	toCalendarEvent,
} from "./types";

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
	const timeMax = new Date(Date.now() + days * ms("1d")).toISOString();

	const { data: calendars } = await listCalendars(client);

	const events = (
		await Promise.all(
			calendars.map((calendar) =>
				client.events.list({
					calendarId: calendar.id as string,
					timeMin,
					timeMax,
					singleEvents: true,
					orderBy: "startTime",
				}),
			),
		)
	).flatMap((res) => res.data.items?.map(toCalendarEvent) ?? []);

	const sorted = orderBy(events, [
		{
			key: "startTime",
			order: "desc",
		},
	]);

	return paginate(sorted ?? [], params.pagination);
}
