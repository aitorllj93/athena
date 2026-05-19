import z from "zod";

import { addPlugin } from "@/lib/plugins/commands/add-plugin";
import { listPlugins } from "@/lib/plugins/commands/list-plugins";
import { removePlugin } from "@/lib/plugins/commands/remove-plugin";
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
		.query(async ({ input }) =>
			listPlugins({
				fields: input.fields as PluginFields[],
				format: input.format,
				groupBy: input.groupBy
					? {
							property: input.groupBy,
							direction: input.groupByDirection,
						}
					: undefined,
			}),
		),
	add: procedure
		.meta({
			description: "Install plugin by name"
		})
		.input(z.string().describe("pluginName"))
		.mutation(async ({ input }) => addPlugin(input)),
	remove: procedure
		.meta({
			aliases: {
				command: ["rm"] 
			},
			description: "Uninstall plugin by name"
		})
		.input(z.string().describe("pluginName"))
		.mutation(async ({ input }) => removePlugin(input)),
});

export default pluginsRouter;
