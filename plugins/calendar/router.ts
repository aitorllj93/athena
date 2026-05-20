import z from "zod";
import { datatypes } from "@/app/common";
import { procedure, router } from "@/lib/trpc";
import { confirmAssistanceCommand } from "./commands/confirm-assistance";
import type { CalendarEventFields } from "./lib";
import { listUpcomingEventsQuery } from "./queries";

const calendar = router({
	agenda: procedure
		.meta({
			description: "Display upcoming events",
		})
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				skipCache: z.boolean().optional(),
			}),
		)
		.query(async ({ input }) => {
			return listUpcomingEventsQuery(
				{
					fields: (input.fields ?? [
						"startTime",
						"summary",
						"id",
					]) as CalendarEventFields[],
					format: input.format,
					groupBy: {
						property: "startDate",
					},
				},
				{
					skipCache: input.skipCache,
				},
			);
		}),
	confirmAssistance: procedure
		.meta({
			description: "Confirm assistance to an event",
		})
		.input(z.tuple([z.string().describe("eventId")]))
		.mutation(async ({ input: [eventId] }) => {
			return confirmAssistanceCommand({
				eventId,
			});
		}),
	upcoming: procedure
		.meta({
			description: "Display upcoming events",
		})
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				groupBy: datatypes.groupBy.optional(),
				groupByDirection: datatypes.groupByDirection,
				limit: datatypes.limit.default(10),
				page: datatypes.page,
				skipCache: z.boolean().optional(),
			}),
		)
		.query(async ({ input }) => {
			return listUpcomingEventsQuery(
				{
					fields: input.fields as CalendarEventFields[],
					format: input.format,
					groupBy: input.groupBy
						? {
								property: input.groupBy,
								direction: input.groupByDirection,
							}
						: undefined,
					pagination: {
						limit: input.limit,
						page: input.page,
					},
				},
				{
					skipCache: input.skipCache,
				},
			);
		}),
});

export default calendar;
