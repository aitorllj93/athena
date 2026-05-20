import type { Mdbase } from "@/lib/providers/mdbase";

type UpdateTaskParams = {
  name: string;
  title?: string;
  priority?: string;
  due?: string;
  scheduled?: string;
  contexts?: string[];
  projects?: string[];
  timeEstimate?: number;
};
export async function updateTask(
  db: Mdbase,
  { name, ...fields }: UpdateTaskParams,
) {
  const typeDef = await db.getType("task");

  const task = db.taskNotes.buildTask(typeDef, {
    ...fields,
    title: fields.title ?? name,
  });
  // TODO: Lookup for path instead of generating

  await db.collection.update({
    path: db.resolvePath(typeDef, name),
    fields: task,
    body: "",
  });
}
