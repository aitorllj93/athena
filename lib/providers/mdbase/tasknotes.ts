import { formatISODate } from "@/lib/utils/date";
import type { TaskNotesFieldRole, TaskNotesTask, TypeDefinition } from "./types";


export class TaskNotes {

  buildTask(typeDef: TypeDefinition, data: TaskNotesTask) {
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
    
    const tasknotesFields = this.getTaskNotesFields(
      typeDef,
      Object.keys(data) as TaskNotesFieldRole[]
    );

    task[tasknotesFields.dateCreated ?? "dateCreated"] = data.dateCreated ?? now;
    task[tasknotesFields.dateModified ?? "dateModified"] = data.dateModified ?? now;

    if (data.title) {
      task[tasknotesFields.title ?? "title"] = data.title;
    }

    if (data.status) {
      task[tasknotesFields.status ?? "status"] = data.status;
    }
  
    if (data.priority) {
      task[tasknotesFields.priority ?? "priority"] = data.priority;
    }
  
    if (data.due) {
      task[tasknotesFields.due ?? "due"] = formatISODate(data.due);
    }
  
    if (data.scheduled) {
      task[tasknotesFields.scheduled ?? "scheduled"] = formatISODate(data.scheduled);
    }
  
    if (data.contexts) {
      task[tasknotesFields.contexts ?? "contexts"] = data.contexts.map(c => `@${c}`);
    }
  
    if (data.projects) {
      task[tasknotesFields.projects ?? "projects"] = data.projects.map(p => `[[${p}}}`);
    }
  
    if (data.timeEstimate) {
      task[tasknotesFields.timeEstimate ?? "timeEstimate"] = data.timeEstimate;
    }
  
    if (data.recurrence) {
      task[tasknotesFields.recurrence ?? "recurrence"] = data.recurrence;
    }
  
    if (data.recurrenceAnchor) {
      task[tasknotesFields.recurrenceAnchor ?? "recurrenceAnchor"] = data.recurrenceAnchor;
    }
  
    if (data.tags) {
      task[tasknotesFields.tags ?? "tags"] = data.tags;
    }
  
    if (data.timeEntries) {
      task[tasknotesFields.timeEntries ?? "timeEntries"] = data.timeEntries;
    }
  
    if (data.reminders) {
      task[tasknotesFields.reminders ?? "reminders"] = data.reminders;
    }
  
    if (data.blockedBy) {
      task[tasknotesFields.blockedBy ?? "blockedBy"] = data.blockedBy;
    }
  
    if (data.completeInstances) {
      task[tasknotesFields.completeInstances ?? "completeInstances"] = data.completeInstances;
    }
  
    if (data.skippedInstances) {
      task[tasknotesFields.skippedInstances ?? "skippedInstances"] = data.skippedInstances;
    }
  
    if (data.icsEventId) {
      task[tasknotesFields.icsEventId ?? "icsEventId"] = data.icsEventId;
    }
  
    if (data.googleCalendarEventId) {
      task[tasknotesFields.googleCalendarEventId ?? "googleCalendarEventId"] = data.googleCalendarEventId;
    }

    return task;
  }

  getTaskNotesFields<T extends TaskNotesFieldRole = TaskNotesFieldRole>(
    typeDef: TypeDefinition, 
    roles: (T | undefined)[]
  ): Partial<Record<T, string>> {

    return roles.reduce((acc, role) => {
      if (!role) {
        return acc;
      }
  
      try {
        return Object.assign(acc, {
          [role]: this.getTaskNotesField(typeDef, role)
        });
      } catch {
        return acc;
      }
    }, {} as Record<T, string>);
  }

  getTaskNotesField(typeDef: TypeDefinition, role: TaskNotesFieldRole) {
    if (!typeDef.fields) {
      throw new Error("Invalid TaskNotes typedef");
    }

    const entry = Object.entries(typeDef.fields).find((([_, def]) => def.tn_role === role));

    if (!entry) {
      throw new Error(`Could not find a field for role "${role}"`);
    }

    return {
      key: entry[0],
      field: entry[1]
    };
    
  }
}