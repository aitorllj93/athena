import { getTranslations } from "@/lib/i18n";
import { type GroupByParams, groupBy as groupByFn } from "@/lib/utils/group";
import { type DeepKeys, getValue } from "@/lib/utils/object";
import type { Format } from "@/lib/utils/render";
import { formatPlugins, formatPluginsGroups } from "../format";
import { type PluginFields, PluginRegistry } from "../registry";
import { PluginRepository } from "../repository";

type ListPluginsArgs = {
	fields?: PluginFields[];
	format?: Format;
	groupBy?: GroupByParams;
};
export async function listPlugins({
	fields = ["pkgName", "installed", "displayName", "version", "description"],
	format = "mdlist2",
	groupBy,
}: ListPluginsArgs = {}): Promise<string> {
	const { t } = await getTranslations("common");
	let out = "";

	const available = PluginRepository.getAvailablePlugins();

	const loaded = PluginRegistry.getPlugins();
	const notLoaded = available.filter(
		(plugin) => !loaded.some((p) => p.name === plugin.name),
	);

	const data = [...loaded, ...notLoaded];

	const groups = groupBy
		? groupByFn(
				data,
				(event) => {
					const value = getValue(
						event,
						groupBy?.property as DeepKeys<typeof event>,
					);

					return value?.toString() ?? "";
				},
				{
					sortGroups: (a, b) => {
						if (a && b) {
							return a.toString().localeCompare(b.toString());
						}

						if (a) {
							return -1;
						}

						if (b) {
							return 1;
						}

						return 0;
					},
				},
			)
		: undefined;

	if (groups) {
		if (groupBy?.property === "installed") {
			groups.forEach(g => {
				g.key = g.key ? t("plugins.fields.installed") : t("plugins.fields.available");
			})
		}

		out += await formatPluginsGroups(groups, format, fields);
	} else if (data) {
		out += await formatPlugins(data, format, fields);
	}

	return out;
}
