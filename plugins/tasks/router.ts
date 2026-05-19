import z from "zod";
import { datatypes } from "@/app/common";
import { procedure, router } from "@/lib/trpc";
import { today, tomorrow, yesterday } from "@/lib/utils/date";
import { completeTaskCommand } from "./commands/complete-task";
import { createTaskCommand } from "./commands/create-task";
import { listScheduledTasksCommand } from "./commands/list-scheduled-tasks";
import type { TaskFields } from "./lib";

const tasks = router({
	scheduled: procedure
		.meta({
			description: "Display the scheduled tasks",
		})
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
				skipCache: z.boolean().optional(),
			}),
		)
		.query(async ({ input }) => {
			return listScheduledTasksCommand(
				{
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
				},
				{
					skipCache: input.skipCache,
				},
			);
		}),
	today: procedure
		.meta({
			description: "Display the scheduled tasks for today",
		})
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				groupBy: datatypes.groupBy.optional(),
				groupByDirection: datatypes.groupByDirection,
				limit: datatypes.limit.default(10),
				skipCache: z.boolean().optional(),
			}),
		)
		.query(async ({ input }) => {
			return listScheduledTasksCommand(
				{
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
				},
				{
					skipCache: input.skipCache,
				},
			);
		}),
	tomorrow: procedure
		.meta({
			description: "Display the scheduled tasks for tomorrow",
		})
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				groupBy: datatypes.groupBy.optional(),
				groupByDirection: datatypes.groupByDirection,
				limit: datatypes.limit.default(10),
				skipCache: z.boolean().optional(),
			}),
		)
		.query(async ({ input }) => {
			return listScheduledTasksCommand(
				{
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
				},
				{
					skipCache: input.skipCache,
				},
			);
		}),
	yesterday: procedure
		.meta({
			description: "Display the scheduled tasks for yesterday",
		})
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				groupBy: datatypes.groupBy.optional(),
				groupByDirection: datatypes.groupByDirection,
				limit: datatypes.limit.default(10),
				skipCache: z.boolean().optional(),
			}),
		)
		.query(async ({ input }) => {
			return listScheduledTasksCommand(
				{
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
				},
				{
					skipCache: input.skipCache,
				},
			);
		}),
	complete: procedure
		.meta({
			description: "Complete a task by name",
		})
		.input(
			z.tuple([
				z.string().describe("taskName"),
			])
		)
		.mutation(async ({ input: [taskName] }) => {
			return completeTaskCommand({
				name: taskName,
			});
		}),
	create: procedure
		.meta({
			description: "Create a task by name",
		})
		.input(
			z.tuple([
				z.string().describe("taskName"),
			])
		)
		.mutation(async ({ input: [taskName] }) => {
			return createTaskCommand({
				name: taskName,
			});
		}),
});

export default tasks;
