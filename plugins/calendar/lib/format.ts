import { getTranslations } from "@/lib/i18n";
import { formatRelative, formatTime } from "@/lib/utils/date";
import type { Group } from "@/lib/utils/group";
import {
	type DisplayFieldDefinition,
	type Format,
	render,
	renderGroup,
} from "@/lib/utils/render";
import type { CalendarEvent, CalendarEventFields } from "./types";

type FieldMap = {
	[K in CalendarEventFields]: DisplayFieldDefinition<CalendarEvent, K>;
};

let columnDefs: DisplayFieldDefinition<CalendarEvent>[] | null = null;

async function getColumnDefs() {
	if (columnDefs) return columnDefs;

	const { t } = await getTranslations("calendar");

	const columnDefsMap = new Map<
		CalendarEventFields,
		FieldMap[CalendarEventFields]
	>([
		[
			"startDate",
			{
				key: "startDate",
				label: t("fields.startDate"),
				format: (_, obj) => {
					if (!obj.startDate) {
						return "";
					}

					return formatRelative(obj.startDate);
				},
			},
		],
		[
			"startTime",
			{
				key: "startTime",
				label: t("fields.startTime"),
				format: (_, obj) => {
					if (!obj.startTime) {
						return "";
					}

					if (!obj.endTime) {
						return formatTime(obj.startTime);
					}

					return `${formatTime(obj.startTime)} - ${formatTime(obj.endTime)}`;
				},
			},
		],
		[
			"summary",
			{
				key: "summary",
				label: t("fields.summary"),
				format: (v) => v ?? "",
			},
		],
		[
			"id",
			{
				key: "id",
				label: t("fields.id"),
				format: (v) => `#${v}`,
			},
		],
	]);

	columnDefs = Array.from(
		columnDefsMap.values(),
	) as DisplayFieldDefinition<CalendarEvent>[];
	return columnDefs;
}

export async function formatCalendarEvents(
	events: CalendarEvent[],
	format?: Format,
	fields?: CalendarEventFields[],
) {
	const colDefs = await getColumnDefs();
	return render(events, {
		columnDefinitions: colDefs,
		fields: fields as CalendarEventFields[],
		format,
	});
}

export async function formatCalendarEventsGroups(
	groups: Group<CalendarEvent>[],
	format?: Format,
	fields?: CalendarEventFields[],
) {
	const colDefs = await getColumnDefs();
	let out = "";

	for (const group of groups) {
		out += await renderGroup(
			formatRelative(new Date(group.key as string)),
			group.items,
			{
				columnDefinitions: colDefs,
				fields,
				format,
			},
		);
		out += "\n\n";
	}

	return out;
}
