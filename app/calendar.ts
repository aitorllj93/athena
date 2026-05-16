import z from "zod";
import { listUpcomingEventsCommand } from "@/commands/list-upcoming-events";
import { procedure, router } from "@/lib/trpc";

const calendar = router({
	agenda: procedure.query(async () => {
		return listUpcomingEventsCommand();
	}),
	listEvents: procedure
		.input(z.object({ limit: z.number().default(10) }))
		.query(async ({ input }) => {
			return listUpcomingEventsCommand({
				pagination: {
					limit: input.limit,
				},
			});
		}),
});

export default calendar;
