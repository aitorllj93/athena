export const dateEquals = (field: string, value: string) =>
	`date(${field}) == date("${value}")`;

export const isScheduled = (value: string) => dateEquals("scheduled", value);
export const isDue = (value: string) => dateEquals("due", value);

export const hasStatus = (value: "open") => `status == "${value}"`;

export default { dateEquals, isDue, isScheduled, hasStatus };
