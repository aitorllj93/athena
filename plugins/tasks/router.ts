import z from "zod";
import { datatypes } from "@/app/common";
import { procedure, router } from "@/lib/trpc";
import { today, tomorrow, yesterday } from "@/lib/utils/date";
import { listScheduledTasksCommand } from "./commands/list-scheduled-tasks";
import type { TaskFields } from "./lib";

const tasks = router({
	scheduled: procedure
		.input(
			z.object({
				date: z
					.string()
					.transform((value) => new Date(value))
					.optional(),
				fields: datatypes.fields,
				format: datatypes.format,
				groupBy: datatypes.groupBy.optional(),
				groupByDirection: datatypes.groupByDirection,
				limit: datatypes.limit.default(10),
			}),
		)
		.query(async ({ input }) => {
			return listScheduledTasksCommand({
				date: input.date,
				fields: input.fields as TaskFields[],
				format: input.format,
				groupBy: input.groupBy
					? {
							property: input.groupBy,
							direction: input.groupByDirection,
						}
					: undefined,
				pagination: {
					limit: input.limit,
				},
			});
		}),
	today: procedure
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				groupBy: datatypes.groupBy.optional(),
				groupByDirection: datatypes.groupByDirection,
				limit: datatypes.limit.default(10),
			}),
		)
		.query(async ({ input }) => {
			return listScheduledTasksCommand({
				date: today(),
				fields: input.fields as TaskFields[],
				format: input.format,
				groupBy: input.groupBy
					? {
							property: input.groupBy,
							direction: input.groupByDirection,
						}
					: undefined,
				pagination: {
					limit: input.limit,
				},
			});
		}),
	tomorrow: procedure
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				groupBy: datatypes.groupBy.optional(),
				groupByDirection: datatypes.groupByDirection,
				limit: datatypes.limit.default(10),
			}),
		)
		.query(async ({ input }) => {
			return listScheduledTasksCommand({
				date: tomorrow(),
				fields: input.fields as TaskFields[],
				format: input.format,
				groupBy: input.groupBy
					? {
							property: input.groupBy,
							direction: input.groupByDirection,
						}
					: undefined,
				pagination: {
					limit: input.limit,
				},
			});
		}),
	yesterday: procedure
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				groupBy: datatypes.groupBy.optional(),
				groupByDirection: datatypes.groupByDirection,
				limit: datatypes.limit.default(10),
			}),
		)
		.query(async ({ input }) => {
			return listScheduledTasksCommand({
				date: yesterday(),
				fields: input.fields as TaskFields[],
				format: input.format,
				groupBy: input.groupBy
					? {
							property: input.groupBy,
							direction: input.groupByDirection,
						}
					: undefined,
				pagination: {
					limit: input.limit,
				},
			});
		}),
});

export default tasks;
