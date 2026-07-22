import ms from "ms";
import { type Group, type GroupByParams, groupBy } from "@/lib/utils/group";
import { type DeepKeys, getValue } from "@/lib/utils/object";
import { orderBy } from "@/lib/utils/order";
import {
	type Pagination,
	type PaginationParams,
	paginate,
} from "@/lib/utils/pagination";

import { listCalendars } from "../calendars";
import type { CalendarClient } from "../client";
import { type CalendarEvent, toCalendarEvent } from "./types";

type ListUpcomingEventsParams = {
	groupBy?: GroupByParams;
	pagination?: PaginationParams;
	days?: number;
};
export async function listUpcomingEvents(
	client: CalendarClient,
	params: ListUpcomingEventsParams,
): Promise<{
	data?: CalendarEvent[];
	groups?: Group<CalendarEvent>[];
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
			order: "asc",
		},
	]);

	const groups = params.groupBy
		? groupBy(
				sorted,
				(event) => {
					if (params.groupBy?.property === "startDate") {
						const start = event.startDate ?? event.endDate;

						if (!start) {
							return "unknown";
						}

						return start.toISOString().slice(0, 10);
					}

					const value = getValue(
						event,
						params.groupBy?.property as DeepKeys<typeof event>,
					);

					return value?.toString() ?? "";
				},
				{
					sortGroups: (a, b) => {
						if (a && b) {
							return a.toString().localeCompare(b.toString());
						}

						if (a) {
							return -1;
						}

						if (b) {
							return 1;
						}

						return 0;
					},
				},
			)
		: undefined;

	const result = paginate(sorted ?? [], params.pagination);

	return {
		...result,
		groups,
	};
}
