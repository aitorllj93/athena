import type { calendar_v3 } from "googleapis";
import type { DeepKeys } from "@/lib/utils/object";

export type CalendarClient = calendar_v3.Calendar;

export type Calendar = calendar_v3.Schema$CalendarListEntry;
export type CalendarEvent = {
  id: string;
  summary?: string;
  startDate?: Date;
  startTime?: Date;
  endDate?: Date;
  endTime?: Date;
}
export type CalendarEventFields = DeepKeys<CalendarEvent>;

export function toCalendarEvent(event: calendar_v3.Schema$Event): CalendarEvent {
  const startDate = event.start?.date ?? event.start?.dateTime;
  const endDate = event.end?.date ?? event.end?.dateTime;
  
  return {
    id: event.id as string,
    summary: event.summary ?? undefined,
    startDate: startDate ? new Date(startDate) : undefined,
    startTime: event.start?.dateTime ? new Date(event.start?.dateTime) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    endTime: event.end?.dateTime ? new Date(event.end?.dateTime) : undefined,
  }
}