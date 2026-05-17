import { getTranslations } from "@/lib/i18n";
import { formatMinutes } from "@/lib/utils/date";
import type { Group } from "@/lib/utils/group";
import {
	type DisplayFieldDefinition,
	type Format,
	render,
	renderGroup,
} from "@/lib/utils/render";
import type { Task, TaskFields } from "./types";

type FieldMap = {
	[K in TaskFields]: DisplayFieldDefinition<Task, K>;
};

function wikilinksToText(str?: string) {
	return str?.replace(
		/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
		(_, target, alias) => {
			if (alias) return alias;
			// Si hay ruta, devuelve solo el nombre del archivo
			const parts = target.split("/");
			return parts[parts.length - 1];
		},
	);
}

let columnDefs: DisplayFieldDefinition<Task>[] | null = null;

async function getColumnDefs() {
	if (columnDefs) return columnDefs;

	const { t } = await getTranslations("tasks");

	const columnDefsMap = new Map<TaskFields, FieldMap[TaskFields]>([
		[
			"status",
			{
				key: "status",
				label: t("fields.status"),
				format: (v) => {
					return t(`status.${v}`);
				},
			},
		],
		["name", { key: "name", label: t("fields.name") }],
		[
			"timeEstimate",
			{
				key: "timeEstimate",
				label: t("fields.timeEstimate"),
				format(v) {
					return formatMinutes(v);
				},
			},
		],
		["block", { key: "block", label: t("fields.block") }],
		[
			"blockedBy",
			{
				key: "blockedBy",
				label: t("fields.blockedBy"),
				format(v) {
					return v?.map((i) => wikilinksToText(i.uid)).join(", ") ?? "";
				},
			},
		],
		[
			"priority",
			{
				key: "priority",
				label: t("fields.priority"),
				format(v) {
					return t(`priorities.${v}`);
				},
			},
		],
		[
			"projects",
			{
				key: "projects",
				label: t("fields.projects"),
				format(v) {
					return v?.map(wikilinksToText).join(", ") ?? "";
				},
			},
		],
	]);

	columnDefs = Array.from(
		columnDefsMap.values(),
	) as DisplayFieldDefinition<Task>[];
	return columnDefs;
}

export async function formatTasks(
	tasks: Task[],
	format?: Format,
	fields?: TaskFields[],
) {
	const colDefs = await getColumnDefs();
	return render(tasks, {
		columnDefinitions: colDefs,
		fields: fields as TaskFields[],
		format,
	});
}

export async function formatTasksGroups(
	groups: Group<Task>[],
	format?: Format,
	fields?: TaskFields[],
) {
	const colDefs = await getColumnDefs();
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
