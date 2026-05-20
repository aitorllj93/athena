import type { Mdbase } from "@/lib/providers/mdbase";
import {
	buildTask,
	parse,
	TASKNOTES_TYPES,
	type TaskNotesTask,
} from "@/lib/providers/mdbase/tasknotes";

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
	const typeDef = await db.getType(TASKNOTES_TYPES.TASK);

	const parsed = parse(name);

	const dto: TaskNotesTask = {
		...parsed,
		...Object.fromEntries(
			Object.entries(fields).filter(([, value]) => value !== undefined),
		),
		title: parsed.title ?? fields.title ?? name,
	};

	const task = buildTask(typeDef, dto);
	task.id = await generateTaskId(db, { projectName: dto.projects?.[0] });

	const result = await db.collection.create({
		path: db.resolvePath(typeDef, `${task.id} ${parsed.title ?? name}`),
		frontmatter: task,
		body: "",
	});

	if (result.error) {
		throw new Error(result.error.message);
	}

	return task;
}
