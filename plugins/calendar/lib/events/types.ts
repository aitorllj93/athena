import type { calendar_v3 } from "googleapis";
import type { DeepKeys } from "@/lib/utils/object";

export type CalendarEvent = {
  id: string;
  status: string;
  htmlLink?: string;
  summary?: string;
  description?: string;
  startDate?: Date;
  startTime?: Date;
  endDate?: Date;
  endTime?: Date;
}
export type CalendarEventFields = DeepKeys<CalendarEvent>;

export const CALENDAR_EVENT_STATUS = {
  /**
   *  The event is confirmed. This is the default status.
   */
  confirmed: "confirmed",
  /**
   *  The event is tentatively confirmed.
   */
  tentative: "tentative",
  /**
   *  The event is cancelled (deleted). The list method returns cancelled events only on incremental sync (when syncToken or updatedMin are specified) or if the showDeleted flag is set to true. 
   *  The get method always returns them. A cancelled status represents two different states depending on the event type:
   *    Cancelled exceptions of an uncancelled recurring event indicate that this instance should no longer be presented to the user. Clients should store these events for the lifetime of the parent recurring event. Cancelled exceptions are only guaranteed to have values for the id, recurringEventId and originalStartTime fields populated. The other fields might be empty.
   *    All other cancelled events represent deleted events. Clients should remove their locally synced copies. Such cancelled events will eventually disappear, so do not rely on them being available indefinitely. Deleted events are only guaranteed to have the id field populated. On the organizer's calendar, cancelled events continue to expose event details (summary, location, etc.) so that they can be restored (undeleted). Similarly, the events to which the user was invited and that they manually removed continue to provide details. However, incremental sync requests with showDeleted set to false will not return these details. If an event changes its organizer (for example via the move operation) and the original organizer is not on the attendee list, it will leave behind a cancelled event where only the id field is guaranteed to be populated
   */
  cancelled: "cancelled"
} as const;
export type CalendarEventStatus = keyof typeof CALENDAR_EVENT_STATUS;

export function toCalendarEvent(event: calendar_v3.Schema$Event): CalendarEvent {
  const startDate = event.start?.date ?? event.start?.dateTime;
  const endDate = event.end?.date ?? event.end?.dateTime;
  
  return {
    id: event.id as string,
    status: event.status as CalendarEventStatus,
    htmlLink: event.htmlLink ?? undefined,
    summary: event.summary ?? undefined,
    description: event.description ?? undefined,
    startDate: startDate ? new Date(startDate) : undefined,
    startTime: event.start?.dateTime ? new Date(event.start?.dateTime) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    endTime: event.end?.dateTime ? new Date(event.end?.dateTime) : undefined,
  }
}
