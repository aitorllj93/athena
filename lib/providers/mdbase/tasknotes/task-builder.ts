import type { TypeDefinition } from "../types";
import type { TaskNotesTask } from "./types";
import { getTaskNotesFields } from "./utils";

export function buildTask(typeDef: TypeDefinition, data: TaskNotesTask) {
	const now = new Date();
	const task: Record<string, unknown> = {
		type: typeDef.name,
	};

	for (const [k, v] of Object.entries(typeDef.fields ?? {})) {
		if (v.computed) {
			continue;
		}

		if (v.default) {
			task[k] = v.default;
		}
	}

	const tasknotesFields = getTaskNotesFields(typeDef);

	task[tasknotesFields.dateCreated.key] = data.dateCreated ?? now;
	task[tasknotesFields.dateModified.key] = data.dateModified ?? now;

	if (data.title) {
		task[tasknotesFields.title.key] = data.title;
	}

	if (data.status) {
		task[tasknotesFields.status.key] = data.status;
	}

	if (data.priority) {
		task[tasknotesFields.priority.key] = data.priority;
	}

	if (data.due) {
		task[tasknotesFields.due.key] = data.due;
	}

	if (data.scheduled) {
		task[tasknotesFields.scheduled.key] = data.scheduled;
	}

	if (data.contexts) {
		task[tasknotesFields.contexts.key] = data.contexts.map((c) => `@${c}`);
	}

	if (data.projects) {
		task[tasknotesFields.projects.key] = data.projects.map((p) => `[[${p}]]`);
	}

	if (data.timeEstimate) {
		task[tasknotesFields.timeEstimate.key] = data.timeEstimate;
	}

	if (data.recurrence) {
		task[tasknotesFields.recurrence.key] = data.recurrence;
	}

	if (data.recurrenceAnchor) {
		task[tasknotesFields.recurrenceAnchor.key] = data.recurrenceAnchor;
	}

	if (data.tags) {
		task[tasknotesFields.tags.key] = data.tags;
	}

	if (data.timeEntries) {
		task[tasknotesFields.timeEntries.key] = data.timeEntries;
	}

	if (data.reminders) {
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

	return task;
}

export default {
	buildTask,
};
