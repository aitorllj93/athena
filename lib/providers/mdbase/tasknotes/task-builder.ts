import type { TypeDefinition } from "../types";
import type { ExtendedTaskNotesTask } from "./types";
import { getTaskNotesFields } from "./utils";

export function buildTask(typeDef: TypeDefinition, data: ExtendedTaskNotesTask) {
	const now = new Date();

	const tasknotesFields = getTaskNotesFields(typeDef);
	
	const task: Record<string, unknown> = {
		// TODO: this should be based on match.where.[key]
		[tasknotesFields.type.key ?? "type"]: tasknotesFields.type.field.default ?? typeDef.name,
		[tasknotesFields.status.key]: data.status ?? tasknotesFields.status.field.default,
	};

	if (data.id) {
		task[tasknotesFields.id.key] = data.id;
	}

	if (data.title) {
		task[tasknotesFields.title.key] = data.title;
	}

	if (data.contexts && data.contexts.length > 0) {
		// TODO: not include the trigger when present
		task[tasknotesFields.contexts.key] = data.contexts.map((c) => `@${c}`);
	}

	if (data.projects && data.projects.length > 0) {
		// TODO: not include the wrapping when present
		task[tasknotesFields.projects.key] = data.projects.map((p) => `[[${p}]]`);
	}

	if (data.priority) {
		task[tasknotesFields.priority.key] = data.priority;
	}

	if (data.timeEstimate) {
		task[tasknotesFields.timeEstimate.key] = data.timeEstimate;
	}

	if (data.due) {
		task[tasknotesFields.due.key] = data.due;
	}

	if (data.scheduled) {
		task[tasknotesFields.scheduled.key] = data.scheduled;
	}

	if (data.recurrence) {
		task[tasknotesFields.recurrence.key] = data.recurrence;
	}

	if (data.recurrenceAnchor) {
		task[tasknotesFields.recurrenceAnchor.key] = data.recurrenceAnchor;
	}

	if (data.tags && data.tags.length > 0) {
		task[tasknotesFields.tags.key] = data.tags;
	}

	if (data.timeEntries && data.timeEntries.length > 0) {
		task[tasknotesFields.timeEntries.key] = data.timeEntries;
	}

	if (data.reminders && data.reminders.length > 0) {
		task[tasknotesFields.reminders.key] = data.reminders;
	}

	if (data.blockedBy) {
		task[tasknotesFields.blockedBy.key] = data.blockedBy;
	}

	if (data.completeInstances) {
		task[tasknotesFields.completeInstances.key] = data.completeInstances;
	}

	if (data.skippedInstances) {
		task[tasknotesFields.skippedInstances.key] = data.skippedInstances;
	}

	if (data.icsEventId) {
		task[tasknotesFields.icsEventId.key] = data.icsEventId;
	}

	if (data.googleCalendarEventId) {
		task[tasknotesFields.googleCalendarEventId.key] =
			data.googleCalendarEventId;
	}

	task[tasknotesFields.dateCreated.key] = data.dateCreated ?? now;
	task[tasknotesFields.dateModified.key] = now;

	return task;
}

export default {
	buildTask,
};
