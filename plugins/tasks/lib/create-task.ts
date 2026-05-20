import type { Mdbase } from "@/lib/providers/mdbase";
import { generateTaskId } from "./generate-task-id";

type CreateTaskParams = {
	name: string;
	title?: string;
	priority?: string;
	due?: string;
	scheduled?: string;
	contexts?: string[];
	projects?: string[];
	timeEstimate?: number;
};
export async function createTask(
	db: Mdbase,
	{ name, ...fields }: CreateTaskParams,
) {
	const typeDef = await db.getType("task");

	const task = db.taskNotes.buildTask(typeDef, {
		...fields,
		title: fields.title ?? name,
	});
	task.id = await generateTaskId(db, { projectName: fields.projects?.[0] });

	await db.collection.create({
		path: db.resolvePath(typeDef, `${task.id} ${name}`),
		frontmatter: task,
		body: "",
	});
}
