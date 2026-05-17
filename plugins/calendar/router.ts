import z from "zod";
import { datatypes } from "@/app/common";
import { procedure, router } from "@/lib/trpc";
import { listUpcomingEventsCommand } from "./commands/list-upcoming-events";
import type { CalendarEventFields } from "./lib";

const calendar = router({
	agenda: procedure
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
			}),
		)
		.query(async ({ input }) => {
			return listUpcomingEventsCommand({
				fields: input.fields as CalendarEventFields[],
				format: input.format,
			});
		}),
	listEvents: procedure
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				limit: datatypes.limit.default(10),
				page: datatypes.page,
			}),
		)
		.query(async ({ input }) => {
			return listUpcomingEventsCommand({
				fields: input.fields as CalendarEventFields[],
				format: input.format,
				pagination: {
					limit: input.limit,
					page: input.page,
				},
			});
		}),
});

export default calendar;
