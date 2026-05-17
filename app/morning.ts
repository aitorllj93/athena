import z from "zod";

import { morningBriefCommand } from "@/commands/morning-brief";
import { procedure, router } from "@/lib/trpc";

import { datatypes } from "./common";

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
