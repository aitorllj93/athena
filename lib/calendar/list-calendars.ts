
import { type Pagination, type PaginationParams, paginate } from "@/lib/utils/pagination";
import type { Calendar, CalendarClient } from "./types";

type ListCalendarsParams = {
  pagination?: PaginationParams;
};
export async function listCalendars(
  client: CalendarClient,
  params: ListCalendarsParams = {},
): Promise<{
  data: Calendar[];
  page: Pagination;
}> {
  const response = await client.calendarList.list();
  const calendars = response.data.items ?? [];

  return paginate(calendars, params.pagination);
}
