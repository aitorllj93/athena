import z from "zod";
import { datatypes } from "@/app/common";
import { procedure, router } from "@/lib/trpc";
import { morningBriefCommand } from "./commands/morning-brief";

const morning = router({
	brief: procedure
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
			}),
		)
		.query(async ({ input }) => {
			return morningBriefCommand(input.fields, input.format);
		}),
});

export default morning;
