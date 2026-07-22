import z from "zod";
import { datatypes } from "@/app/common";
import { procedure, router } from "@/lib/trpc";
import { morningBriefQuery } from "./queries/morning-brief";

const morning = router({
	brief: procedure
		.meta({
			description: "Display a summary of the tasks and agenda for the day",
		})
		.input(
			z.object({
				format: datatypes.format,
				skipCache: z.boolean().optional(),
			}),
		)
		.query(async ({ input }) => {
			return morningBriefQuery(
				{
					format: input.format,
				},
				{
					skipCache: input.skipCache,
				},
			);
		}),
});

export default morning;
