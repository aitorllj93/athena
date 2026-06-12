import type { FieldDefinition } from "../types";
import type { TaskNotesFieldRole } from "./types";

export const TASKNOTES_TYPES = {
  TASK: "task",
  PROJECT: "project",
} as const;

export const TASKNOTES_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  DONE: "done",
  WONT_DO: "wont-do",
  BLOCKED: "blocked"
} as const;

export const TASKNOTES_TAGS = {
  ARCHIVE: "archive",
} as const;

export const TASKNOTES_FIELDS_DEFAULTS: Record<TaskNotesFieldRole, FieldDefinition> = {
  title: {
    type: "string",
    required: true,
    description: "Short summary of the task.",
    tn_role: "title"
  },

  status: {
    type: "enum",
    required: true,
    values: ["open", "in-progress", "done", "wont-do", "blocked"],
    tn_completed_values: ["done", "wont-do"],
    default: "open",
    tn_role: "status"
  },

  priority: {
    type: "enum",
    values: ["6-minimum", "5-low", "4-none", "3-medium", "2-high", "1-maximum"],
    default: "4-none",
    tn_role: "priority"
  },

  due: {
    type: "date",
    tn_role: "due"
  },

  scheduled: {
    type: "date",
    tn_role: "scheduled"
  },

  contexts: {
    type: "list",
    tn_role: "contexts",
    items: {
      type: "string"
    }
  },

  projects: {
    type: "list",
    description: "Wikilinks to related project notes.",
    tn_role: "projects",
    items: {
      type: "link"
    }
  },

  timeEstimate: {
    type: "integer",
    min: 0,
    description: "Estimated time in minutes.",
    tn_role: "timeEstimate"
  },

  completedDate: {
    type: "date",
    tn_role: "completedDate"
  },

  dateCreated: {
    type: "datetime",
    required: true,
    tn_role: "dateCreated"
  },

  dateModified: {
    type: "datetime",
    tn_role: "dateModified"
  },

  recurrence: {
    type: "string",
    tn_role: "recurrence"
  },

  recurrenceAnchor: {
    type: "enum",
    values: ["scheduled", "completion"],
    default: "scheduled",
    tn_role: "recurrenceAnchor"
  },

  tags: {
    type: "list",
    tn_role: "tags",
    items: {
      type: "string"
    }
  },

  timeEntries: {
    type: "list",
    tn_role: "timeEntries",
    items: {
      type: "object",
      fields: {
        startTime: {
          type: "datetime"
        },
        endTime: {
          type: "datetime"
        },
        description: {
          type: "string"
        },
        duration: {
          type: "integer"
        }
      }
    }
  },

  reminders: {
    type: "list",
    description: "Reminder objects with id, type, offset, etc.",
    tn_role: "reminders",
    items: {
      type: "object",
      fields: {
        id: {
          type: "string",
          required: true
        },
        type: {
          type: "enum",
          values: ["absolute", "relative"]
        },
        description: {
          type: "string"
        },
        relatedTo: {
          type: "enum",
          values: ["due", "scheduled"],
          description: "Field the reminder is relative to (e.g. 'due')."
        },
        offset: {
          type: "string",
          description: "ISO 8601 duration offset (e.g. '-PT1H')."
        },
        absoluteTime: {
          type: "datetime"
        }
      }
    }
  },

  blockedBy: {
    type: "list",
    tn_role: "blockedBy",
    items: {
      type: "object",
      fields: {
        uid: {
          type: "link",
          required: true
        },
        reltype: {
          type: "string"
        },
        gap: {
          type: "string"
        }
      }
    }
  },

  completeInstances: {
    type: "list",
    tn_role: "completeInstances",
    items: {
      type: "date"
    }
  },

  skippedInstances: {
    type: "list",
    tn_role: "skippedInstances",
    items: {
      type: "date"
    }
  },

  icsEventId: {
    type: "list",
    tn_role: "icsEventId",
    items: {
      type: "string"
    }
  },

  googleCalendarEventId: {
    type: "string",
    tn_role: "googleCalendarEventId"
  },
};