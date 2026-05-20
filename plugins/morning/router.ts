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
				fields: datatypes.fields,
				format: datatypes.format,
			}),
		)
		.query(async ({ input }) => {
			return morningBriefQuery(input.fields, input.format);
		}),
});

export default morning;
