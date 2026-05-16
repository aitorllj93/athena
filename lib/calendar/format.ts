import { format } from "date-fns/format";
import { DEFAULT_FORMAT } from "../constants";
import type { Format } from "../types";
import type { CalendarEvent } from "./types";

const rtf = new Intl.RelativeTimeFormat("es", {
	numeric: "auto",
});

const weekdayFormatter = new Intl.DateTimeFormat("es", {
	weekday: "long",
});

const dateFormatter = new Intl.DateTimeFormat("es", {
	day: "numeric",
	month: "long",
});

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function diffDays(a: Date, b: Date) {
	const MS_PER_DAY = 1000 * 60 * 60 * 24;

	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	return Math.round((utc1 - utc2) / MS_PER_DAY);
}

function formatDate(date: Date) {
	const now = new Date();
	const diff = diffDays(date, now);

	// Hoy / Mañana / Ayer
	if (diff >= -1 && diff <= 1) {
		return capitalize(rtf.format(diff, "day"));
	}

	// misma semana
	const nowWeekday = now.getDay();
	const startOfWeek = new Date(now);
	startOfWeek.setDate(now.getDate() - nowWeekday);

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 7);

	if (date >= startOfWeek && date < endOfWeek) {
		return `El ${capitalize(weekdayFormatter.format(date))}`;
	}

	// 26 de diciembre
	return capitalize(dateFormatter.format(date));
}

function formatTime(event: CalendarEvent) {
	const start = event.start?.dateTime
		? format(new Date(event.start.dateTime), "HH:mm")
		: null;
	const end = event.end?.dateTime
		? format(new Date(event.end.dateTime), "HH:mm")
		: null;

	if (!start) {
		return "";
	}

	if (!end) {
		return `${start}`;
	}

	return `${start} - ${end}`;
}

function formatMinimal(event: CalendarEvent) {
	const time = formatTime(event);

	return time ? `${time} ${event.summary}` : event.summary;
}

function formatRegular(event: CalendarEvent) {
	const time = formatTime(event);

	return `${time ? `${time} ` : ""}${event.summary} (ID: ${event.id})`;
}

function formatXML(event: CalendarEvent) {
	return `<event>
  <uid>${event.id}</uid>
  <summary>${event.summary}</summary>
  <start>${event.start?.dateTime ?? event.start?.date}</start>
  <end>${event.start?.dateTime ?? event.end?.date}</end>
</event>`;
}

export function formatEvent(
	event: CalendarEvent,
	format: Format = DEFAULT_FORMAT,
) {
	if (format === "xml") {
		return formatXML(event);
	}

	if (format === "regular") {
		return formatRegular(event);
	}

	return formatMinimal(event);
}

function formatGroupMinimal(group: Date) {
	return formatDate(group);
}

function formatGroupRegular(group: Date) {
	return `- ${formatDate(group)}
`;
}

function formatGroupXML(group: string | number | Date) {
	return `<group>
${group}
</group>`;
}

export function formatGroup(
	date: string | number | Date,
	format: Format = DEFAULT_FORMAT,
) {
	if (format === "xml") {
		return formatGroupXML(date);
	}

	if (format === "regular") {
		return formatGroupRegular(new Date(date));
	}

	return formatGroupMinimal(new Date(date));
}
