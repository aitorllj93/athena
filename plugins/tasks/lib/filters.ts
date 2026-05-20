import type { TaskNotesFieldRole } from "@/lib/providers/mdbase";


export const belongsToProject = (
	value: string,
	fields?: Record<TaskNotesFieldRole, string>,
	{ asLink = true }: { asLink: boolean }
) =>
	`${fields?.projects ?? "projects"}.contains("[[${value}]]")`;

export const dateEquals = (field: string, value: string) =>
	`date(${field}) == date("${value}")`;

export const isScheduled = (value: string) => dateEquals("scheduled", value);
export const isDue = (value: string) => dateEquals("due", value);

export const hasStatus = (
	value: "open",
	fields?: Record<TaskNotesFieldRole, string>,
) => `${fields?.status ?? "status"} == "${value}"`;

export default { belongsToProject, dateEquals, isDue, isScheduled, hasStatus };
