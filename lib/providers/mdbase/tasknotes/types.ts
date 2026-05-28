import type { FieldDefinition } from "../types";


export type TaskNotesTaskStatus =
  | "open"
  | "in-progress"
  | "done"
  | "wont-do"
  | "blocked";

export type TaskNotesTaskBlockerRelType = "FINISHTOSTART";

export type TaskNotesTaskReminder = {
  id: string;
  type: "absolute" | "relative";
  description?: string;
  /**
   * Field the reminder is relative to (e.g. 'due')
   */
  relatedTo?: "due" | "scheduled";
  /**
   * ISO 8601 duration offset (e.g. '-PT1H').
   */
  offset?: string;
  absoluteTime?: string;
}

export type TaskNotesTaskTimeEntry = {
  startTime?: Date;
  endTime?: Date;
  description?: string;
  duration?: number;
};

export type TaskNotesTaskBlocker = {
  uid: string;
  reltype: TaskNotesTaskBlockerRelType;
  gap?: string;
};

export type TaskNotesTask = {
  title?: string;
  status?: string;
  priority?: string;
  due?: string;
  scheduled?: string;
  contexts?: string[];
  projects?: string[];
  timeEstimate?: number;
  completedDate?: Date;
  dateCreated?: Date;
  dateModified?: Date;
  recurrence?: string;
  recurrenceAnchor?: "scheduled" | "completion";
  tags?: string[];
  timeEntries?: TaskNotesTaskTimeEntry[];
  reminders?: TaskNotesTaskReminder[];
  blockedBy?: TaskNotesTaskBlocker[];
  completeInstances?: Date[];
  skippedInstances?: Date[];
  icsEventId?: string;
  googleCalendarEventId?: string;
};

export type TaskNotesFieldRole = keyof Required<TaskNotesTask>;

export type TaskNotesFieldsMapping = Record<TaskNotesFieldRole, { key: string; field: FieldDefinition }>