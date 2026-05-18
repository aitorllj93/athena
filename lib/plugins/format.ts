import {
	type DisplayFieldDefinition,
	type Format,
	render,
	renderGroup,
} from "@/lib/utils/render";
import { getTranslations } from "../i18n";
import type { Group } from "../utils/group";
import type { Plugin, PluginFields } from "./registry";

type FieldMap = {
	[K in PluginFields]: DisplayFieldDefinition<Plugin, K>;
};

let columnDefs: DisplayFieldDefinition<Plugin>[] | null = null;
async function getColumnDefs(plugins: Plugin[]) {
	if (columnDefs) return columnDefs;

	const { t } = await getTranslations("common", {
		namespaces: plugins.map(p => p.name)
	});

	const longestPkgName = plugins.reduce(
		(max, plugin) => Math.max(max, plugin.pkgName?.length ?? 0),
		0
	);

	const columnDefsMap = new Map<PluginFields, FieldMap[PluginFields]>([
		[
			"name",
			{
				key: "name",
				label: t("plugins.fields.name"),
			},
		],
		[
			"pkgName",
			{
				key: "pkgName",
				label: t("plugins.fields.pkgName"),
				format(v, o) {
					// For local packages we display the name for simplicity
					return ((o.isLocal ? o.name : v) ?? "").padEnd(longestPkgName, " ");
				}
			},
		],
		[
			"installed",
			{
				key: "installed",
				label: t("plugins.fields.installed"),
				format(v) {
					return v ? "✔︎" : " "
				}
			},
		],
		[
			"displayName",
			{
				key: "displayName",
				label: t("plugins.fields.displayName"),
				format(v, o) {
					return t("displayName", {
						defaultValue: v ?? o.name,
						ns: o.name
					}).padEnd(10, " ");
				}
			},
		],
		[
			"version",
			{
				key: "version",
				label: t("plugins.fields.version"),
			},
		],
		[
			"description",
			{
				key: "description",
				label: t("plugins.fields.description"),
				format(v, o) {
					return t("description", {
						defaultValue: v ?? "",
						ns: o.name
					});
				}
			},
		],
		[
			"commands",
			{
				key: "commands",
				label: t("plugins.fields.commands"),
				format(v) {
					return v ? Object.keys(v).join(", ") : '';
				}
			}
		]
	]);

	columnDefs = Array.from(
		columnDefsMap.values(),
	) as DisplayFieldDefinition<Plugin>[];
	return columnDefs;
}

export async function formatPlugins(
	plugins: Plugin[],
	format?: Format,
	fields?: PluginFields[],
) {
	const colDefs = await getColumnDefs(plugins);
	return render(plugins, {
		columnDefinitions: colDefs,
		fields: fields as PluginFields[],
		format,
	});
}

export async function formatPluginsGroups(
	groups: Group<Plugin>[],
	format?: Format,
	fields?: PluginFields[],
) {
	const colDefs = await getColumnDefs(groups.flatMap(g => g.items));
	let out = "";

	for (const group of groups) {
		out += await renderGroup(group.key as string, group.items, {
			columnDefinitions: colDefs,
			fields,
			format,
		});
		out += "\n\n";
	}

	return out;
}
