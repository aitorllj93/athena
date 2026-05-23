import type { Mdbase } from "@/lib/providers/mdbase";
import { buildTask } from "@/lib/providers/mdbase/tasknotes";
import { lookupTask } from "./lookup-task";

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
	const task = await lookupTask(db, { taskNameOrId: name });
	
	const typeDef = await db.getType("task");

	const dto = buildTask(typeDef, {
		...fields,
		title: fields.title ?? name,
	});

	const res = await db.collection.update({
		path: task.path,
		fields: dto,
		body: "",
	});

	if (res.error) {
		throw new Error(res.error.message);
	}

	return task;
}
