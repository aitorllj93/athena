import { formatRelative, formatTime } from "@/lib/utils/date";
import { DEFAULT_FORMAT } from "../constants";
import type { Format } from "../types";
import type { CalendarEvent } from "./types";

function formatEventTime(event: CalendarEvent) {
	const start = event.start?.dateTime ? formatTime(event.start.dateTime) : null;
	const end = event.end?.dateTime ? formatTime(event.end.dateTime) : null;

	if (!start) {
		return "";
	}

	if (!end) {
		return `${start}`;
	}

	return `${start} - ${end}`;
}

function formatMinimal(event: CalendarEvent) {
	const time = formatEventTime(event);

	return time ? `${time} ${event.summary}` : event.summary;
}

function formatRegular(event: CalendarEvent) {
	const time = formatEventTime(event);

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
	return formatRelative(group);
}

function formatGroupRegular(group: Date) {
	return `- ${formatRelative(group)}
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
