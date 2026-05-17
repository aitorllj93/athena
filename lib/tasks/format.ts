import { getTranslations } from "@/lib/i18n";
import {
	type DisplayFieldDefinition,
	type Format,
	render,
} from "@/lib/utils/render";
import { formatMinutes } from "../utils/date";
import type { Task, TaskFields } from "./types";

const { t } = await getTranslations("tasks");

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

const COLUMN_DEFS_MAP = new Map<TaskFields, FieldMap[TaskFields]>([
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
				return v?.map((i) => wikilinksToText(i.uid)).join(", ") ?? '';
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
				return v?.map(wikilinksToText).join(", ") ?? '';
			},
		},
	],
]);
const COLUMN_DEFS = Array.from(
	COLUMN_DEFS_MAP.values(),
) as DisplayFieldDefinition<Task>[];

export function formatTasks(
	tasks: Task[],
	format?: Format,
	fields?: TaskFields[],
) {
	return render(tasks, {
		columnDefinitions: COLUMN_DEFS,
		fields: fields as TaskFields[],
		format,
	});
}
