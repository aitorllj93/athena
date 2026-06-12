import z from "zod";

import type { PluginFields } from "@/lib/plugins/registry";
import { procedure, router } from "@/lib/trpc";
import { datatypes } from "./common";

export const pluginsRouter = router({
	list: procedure
		.meta({
			description: "List installed and available plugins"
		})
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format.default("mdlist2"),
				groupBy: datatypes.groupBy.optional(),
				groupByDirection: datatypes.groupByDirection,
			}),
		)
		.query(async ({ input }) => {
			const { listPlugins } = await import("@/lib/plugins/commands/list-plugins");
			return listPlugins({
				fields: input.fields as PluginFields[],
				format: input.format,
				groupBy: input.groupBy
					? {
							property: input.groupBy,
							direction: input.groupByDirection,
						}
					: undefined,
			});
		}),
	add: procedure
		.meta({
			description: "Install plugin by name"
		})
		.input(
			z.tuple([
				z.string().describe("pluginName")
			])
		)
		.mutation(async ({ input: [pluginName] }) => {
			const { addPlugin } = await import("@/lib/plugins/commands/add-plugin");
			return addPlugin(pluginName);
		}),
	remove: procedure
		.meta({
			aliases: {
				command: ["rm"] 
			},
			description: "Uninstall plugin by name"
		})
		.input(
			z.tuple([
				z.string().describe("pluginName")
			])
		)
		.mutation(async ({ input: [pluginName] }) => {
			const { removePlugin } = await import("@/lib/plugins/commands/remove-plugin");
			return removePlugin(pluginName);
		}),
});

export default pluginsRouter;
