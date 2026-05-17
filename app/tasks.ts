import z from "zod";
import { listScheduledTasksCommand } from "@/commands/list-scheduled-tasks";
import { procedure, router } from "@/lib/trpc";

const tasks = router({
	today: procedure
		.input(z.object({ limit: z.number().default(10) }))
		.query(async ({ input }) => {
			return listScheduledTasksCommand({
				pagination: {
					limit: input.limit,
				},
			});
		}),
});

export default tasks;
