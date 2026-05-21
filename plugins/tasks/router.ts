import ms from "ms";
import z from "zod";
import { datatypes } from "@/app/common";
import { commaSeparatedValues } from "@/app/common/datatypes";
import { procedure, router } from "@/lib/trpc";
import { msToIsoDuration, today, tomorrow, yesterday } from "@/lib/utils/date";
import {
	archiveTaskCommand,
	completeTaskCommand,
	createTaskCommand,
	updateTaskCommand,
} from "./commands";
import type { ProjectFields, TaskFields } from "./lib";
import { listProjectTasksQuery, listScheduledTasksQuery } from "./queries";
import { listProjectsQuery } from "./queries/list-projects";

const offset = z
	.union([z.string(), z.number()])
	.transform(v => 
		msToIsoDuration(typeof v === "number" ? v * 1000 : ms(v as ms.StringValue))
	);

z.iso.duration()

const priority = z
	.enum(["minimum", "low", "none", "medium", "high", "maximum"])
	.transform((value) => {
		const map = {
			minimum: "6-minimum",
			low: "5-low",
			none: "4-none",
			medium: "3-medium",
			high: "2-high",
			maximum: "1-maximum",
		} as const;

		return map[value];
	});

const timeEstimate = z
	.union([z.string(), z.number()])
	.transform((v) =>
		typeof v === "number" ? v : ms(v as ms.StringValue) / 1000,
	);

const duration = z
	.union([z.string(), z.number()])
	.transform((v) =>
		typeof v === "number" ? v : ms(v as ms.StringValue) / 1000,
	);

const tasks = router({
	archive: procedure
		.meta({
			description: "Archive a task and mark it as won't do",
			examples: [
				"archive PKM-1",
			],
		})
		.input(z.tuple([z.string().describe("taskNameOrId")]))
		.mutation(async ({ input: [name] }) => {
			return archiveTaskCommand({
				name,
			});
		}),
	list: router({
		project: procedure
			.meta({
				description: "Display the tasks from a project",
			})
			.input(
				z.tuple([
					z.string().describe("projectNameOrId"),
					z.object({
						fields: datatypes.fields,
						format: datatypes.format,
						groupBy: datatypes.groupBy.optional(),
						groupByDirection: datatypes.groupByDirection,
						limit: datatypes.limit.default(10),
						skipCache: z.boolean().optional(),
					}),
				])
			)
			.query(async ({ input: [projectName, params] }) => {
				return listProjectTasksQuery(
					{
						projectName,
						fields: params.fields as TaskFields[],
						format: params.format,
						groupBy: params.groupBy
							? {
									property: params.groupBy,
									direction: params.groupByDirection,
								}
							: undefined,
						pagination: {
							limit: params.limit,
						},
					},
					{
						skipCache: params.skipCache,
					},
				);
			}),
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
				return listScheduledTasksQuery(
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
				return listScheduledTasksQuery(
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
				return listScheduledTasksQuery(
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
				return listScheduledTasksQuery(
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
	}),
	projects: router({
		list: procedure
			.meta({
				description: "Display the projects",
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
				return listProjectsQuery(
					{
						fields: input.fields as ProjectFields[],
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
	}),
	complete: procedure
		.meta({
			description: "Complete a task",
			examples: [
				"complete PKM-1",
			],
		})
		.input(
			z.tuple(
				[z.string().describe("taskNameOrId")],
				z.object({
					archive: z.boolean().default(false),
				}),
			),
		)
		.mutation(async ({ input: [name, params] }) => {
			return completeTaskCommand({
				name,
				archive: params?.archive,
			});
		}),
	create: procedure
		.meta({
			description: "Create a task",
			aliases: {
				options: {
					title: "t",
					priority: "pr",
					due: "d",
					scheduled: "s",
					contexts: "c",
					projects: "p",
					timeEstimate: "e",
				},
			},
			examples: [
				'create "Pay rent tomorrow 9am #finance @home +admin every month"',
				'create "Pagar el alquiler mañana 9am #finanzas @casa +admin todos los meses"'
			]
		})
		.input(
			z.tuple([
				z.string().describe("taskName"),
				z.object({
					title: z.string().optional(),
					priority: priority.optional(),
					due: z.iso.date().optional(),
					scheduled: z.iso.date().optional(),
					contexts: commaSeparatedValues.optional(),
					projects: commaSeparatedValues.optional(),
					timeEstimate: timeEstimate.optional(),
				}),
			]),
		)
		.mutation(async ({ input: [name, params] }) => {
			return createTaskCommand({
				name,
				title: params.title,
				priority: params.priority,
				due: params.due,
				scheduled: params.scheduled,
				contexts: params.contexts,
				projects: params.projects,
				timeEstimate: params.timeEstimate,
			});
		}),
	update: procedure
		.meta({
			description: "Update a task",
			aliases: {
				options: {
					title: "t",
					priority: "pr",
					due: "d",
					scheduled: "s",
					contexts: "c",
					projects: "p",
					timeEstimate: "e",
				},
			},
		})
		.input(
			z.tuple([
				z.string().describe("taskNameOrId"),
				z.object({
					title: z.string().optional(),
					priority: priority.optional(),
					due: z.iso.date().optional(),
					scheduled: z.iso.date().optional(),
					contexts: commaSeparatedValues.optional(),
					projects: commaSeparatedValues.optional(),
					timeEstimate: timeEstimate.optional(),
				}),
			]),
		)
		.mutation(async ({ input: [name, params] }) => {
			return updateTaskCommand({
				name,
				...params,
			});
		}),
	estimate: procedure
		.meta({
			description: "Estimate a task",
			examples: [
				"estimate PKM-1 3h",
				"estimate PKM-2 20m",
			],
		})
		.input(
			z.tuple([
				z.string().describe("taskNameOrId"),
				timeEstimate.describe("timeEstimate"),
			]),
		)
		.mutation(async ({ input: [name, timeEstimate] }) => {
			return updateTaskCommand({
				name,
				timeEstimate
			});
		}),
	block: procedure
		.meta({
			description: "Set a task blocker",
			examples: [
				"block PKM-1 PKM-2",
				"block PKM-1 PKM-2,PKM-3",
			],
		})
		.input(
			z.tuple([
				z.string().describe("taskNameOrId"),
				commaSeparatedValues.describe("blockerNameOrId"),
				z.object({
					reltype: z.string().optional(),
					gap: z.string().optional(),
				})
			]),
		)
		.mutation(async ({ input: [name, blocker, scheduled] }) => {
			// TODO: Implement block command
			throw new Error('Method not implemented')
		}),
	remind: procedure
		.meta({
			description: "Set a task reminder",
			examples: [
				"remind PKM-1 --when scheduled --before 30m",
				'remind PKM-2 --at "12:30"'
			],
		})
		.input(
			z.tuple([
				z.string().describe("taskNameOrId"),
				z.string().describe("description").optional(),
				z.object({
					when: z.enum(["due", "scheduled"]).optional(),
					after: offset.optional(),
					before: offset.optional(),
					at: z.iso.datetime().optional(),
				})
			]),
		)
		.mutation(async ({ input: [name, description, scheduled] }) => {
			// TODO: Implement remind command
			throw new Error('Method not implemented')
		}),
	schedule: procedure
		.meta({
			description: "Schedule a task",
			examples: [
				"schedule PKM-1 2026-12-31"
			],
		})
		.input(
			z.tuple([
				z.string().describe("taskNameOrId"),
				z.iso.date().describe("at"),
			]),
		)
		.mutation(async ({ input: [name, scheduled] }) => {
			return updateTaskCommand({
				name,
				scheduled
			});
		}),
	set: router({
		context: procedure
			.meta({
				description: "Set Context for a task",
				examples: [
					"set context PKM-1 management",
					"set context PKM-2 creativity,home"
				],
			})
			.input(
				z.tuple([
					z.string().describe("taskNameOrId"),
					commaSeparatedValues.describe("contexts")
				]),
			)
			.mutation(async ({ input: [name, contexts] }) => {
				return updateTaskCommand({
					name,
					contexts,
				});
			}),
		priority: procedure
			.meta({
				description: "Set Priority for a task",
				examples: [
					"set priority PKM-1 low",
					"set priority PKM-2 high"
				],
			})
			.input(
				z.tuple([
					z.string().describe("taskNameOrId"),
					priority.describe("priority")
				]),
			)
			.mutation(async ({ input: [name, priority] }) => {
				return updateTaskCommand({
					name,
					priority
				});
			}),
		project: procedure
			.meta({
				description: "Set Project for a task",
				examples: [
					"set project PKM-1 BBL",
					"set project PKM-2 PKM,BBL"
				],
			})
			.input(
				z.tuple([
					z.string().describe("taskNameOrId"),
					commaSeparatedValues.describe("projects")
				]),
			)
			.mutation(async ({ input: [name, projects] }) => {
				return updateTaskCommand({
					name,
					projects,
				});
			}),
		due: procedure
			.meta({
				description: "Set Due for a task",
				examples: [
					"set due PKM-1 2026-12-31"
				],
			})
			.input(
				z.tuple([
					z.string().describe("taskNameOrId"),
					z.iso.date().describe("due"),
				]),
			)
			.mutation(async ({ input: [name, due] }) => {
				return updateTaskCommand({
					name,
					due,
				});
			}),
	}),
	track: procedure
		.meta({
			description: "Tracks a task time",
		})
		.input(
			z.tuple([
				z.string().describe("taskNameOrId"),
				z.string().describe("description").optional(),
				z.object({
					startTime: z.iso.datetime().optional(),
					endTime: z.iso.datetime().optional(),
					duration: duration.optional(),
				})
			]),
		)
		.mutation(async ({ input: [name, description, scheduled] }) => {
			// TODO: Implement block command
			throw new Error('Method not implemented')
		}),
});

export default tasks;
