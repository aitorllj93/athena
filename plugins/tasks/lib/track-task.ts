import type { Mdbase } from "@/lib/providers/mdbase";
import { getTaskNotesFields } from "@/lib/providers/mdbase/tasknotes";
import { lookupTask } from "./lookup-task";
import type { TaskTimeEntry } from "./types";

type TrackTaskParams = {
  name: string;
  description?: string;
  startTime?: string;
  endTime?: string;
};
export async function trackTask(
  db: Mdbase,
  { name, ...fields }: TrackTaskParams,
): Promise<TaskTimeEntry> {
  const task = await lookupTask(db, { taskNameOrId: name });
  
  const typeDef = await db.getType("task");
  const tasknotesFields = getTaskNotesFields(typeDef);

  let result: TaskTimeEntry;

  const timeEntries: TaskTimeEntry[] = [
    ...(task.timeEntries ?? [])
  ];

  if (fields.startTime && fields.endTime) {
    // case 1: full entry
    const startTime = new Date();
    console.log(startTime);
    const [sh, sm, ss] = fields.startTime.split(":").map(Number);
    startTime.setHours(sh ?? 0, sm ?? 0, ss ?? 0, 0);
    console.log(startTime);
    const endTime = new Date();
    const [eh, em, es] = fields.endTime.split(":").map(Number);
    endTime.setHours(eh ?? 0, em ?? 0, es ?? 0, 0);
    
    result = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
    timeEntries.push(result);
  } else if (fields.startTime) {
    // case 2: new entry
    const startTime = new Date();
    const [sh, sm, ss] = fields.startTime.split(":").map(Number);
    startTime.setHours(sh ?? 0, sm ?? 0, ss ?? 0, 0);
    
    result = {
      startTime: startTime.toISOString(),
    };
    timeEntries.push(result);
  } else if (fields.endTime) {
    // case 3: complete entry
    result = timeEntries.find(e => e.startTime && !e.endTime) as TaskTimeEntry;

    if (!result) {
      throw new Error(`There's no pending entry to close`);
    }

    const endTime = new Date();
    const [eh, em, es] = fields.endTime.split(":").map(Number);
    endTime.setHours(eh ?? 0, em ?? 0, es ?? 0, 0);

    result.endTime = endTime.toISOString();
  } else {
    // case 4: start/complete entry
    result = timeEntries.find(e => e.startTime && !e.endTime) as TaskTimeEntry;

    if (result) {
      result.endTime = new Date().toISOString();
    } else {
      result = {
        startTime: new Date().toISOString(),
      }
      timeEntries.push(result);
    }
  }

  if (fields.description) {
    result.description = fields.description;
  }

  const res = await db.collection.update({
    path: task.path,
    fields: {
      [tasknotesFields.timeEntries.key]: timeEntries 
    },
  });

  if (res.error) {
    throw new Error(res.error.message);
  }

  return result;
}
