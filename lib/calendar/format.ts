import { getTranslations } from "@/lib/i18n";
import { formatRelative, formatTime } from "@/lib/utils/date";
import {
	type DisplayFieldDefinition,
	type Format,
	render,
	renderGroup,
} from "@/lib/utils/render";

import type { CalendarEvent, CalendarEventFields } from "./types";

const { t } = await getTranslations("calendar");

type FieldMap = {
	[K in CalendarEventFields]: DisplayFieldDefinition<CalendarEvent, K>;
};

const COLUMN_DEFS_MAP = new Map<
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
const COLUMN_DEFS = Array.from(
	COLUMN_DEFS_MAP.values(),
) as DisplayFieldDefinition<CalendarEvent>[];

export function formatCalendarEvents(
	events: CalendarEvent[],
	format?: Format,
	fields?: CalendarEventFields[],
) {
	return render(events, {
		columnDefinitions: COLUMN_DEFS,
		fields: fields as CalendarEventFields[],
		format,
	});
}

export function formatCalendarEventsGroup(
	title: string,
	events: CalendarEvent[],
	format?: Format,
	fields?: CalendarEventFields[],
) {
	return renderGroup(title, events, {
		columnDefinitions: COLUMN_DEFS,
		fields: fields as CalendarEventFields[],
		format,
	});
}
