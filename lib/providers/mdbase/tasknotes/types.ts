import type { FieldDefinition } from "../types";


export type TaskNotesTaskStatus =
  | "open"
  | "in-progress"
  | "done"
  | "wont-do"
  | "blocked";

export type TaskNotesTask = {
  title?: string;
  status?: TaskNotesTaskStatus;
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
  timeEntries?: {
    startTime?: Date;
    endTime?: Date;
    description?: string;
    duration?: number;
  }[];
  reminders?: {
    id: string;
    type: "absolute" | "relative";
    description?: string;
    /**
     * Field the reminder is relative to (e.g. 'due')
     */
    relatedTo: "due" | "scheduled";
    /**
     * ISO 8601 duration offset (e.g. '-PT1H').
     */
    offset?: string;
    absoluteTime?: Date;
  };
  blockedBy?: {
    uid: string;
    reltype: string;
    gap?: string;
  }[];
  completeInstances?: Date[];
  skippedInstances?: Date[];
  icsEventId?: string;
  googleCalendarEventId?: string;
};

export type TaskNotesFieldRole = keyof Required<TaskNotesTask>;

export type TaskNotesFieldsMapping = Record<TaskNotesFieldRole, { key: string; field: FieldDefinition }>