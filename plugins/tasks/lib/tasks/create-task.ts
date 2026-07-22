import type { Mdbase } from "@/lib/providers/mdbase";
import {
	buildTask,
	getTaskNotesFields,
	parse,
	TASKNOTES_TYPES,
	type TaskNotesTask,
} from "@/lib/providers/mdbase/tasknotes";
import { getProject } from "../projects/get-project";
import { generateTaskId } from "./generate-task-id";
import { fromTaskNote } from "./types";

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

	const project = dto.projects?.[0]
		? await getProject(db, {
				projectName: dto.projects?.[0],
			}).catch(() => undefined)
		: undefined;

	if (project && dto.projects) {
		dto.projects[0] = project.name;
	}

	const fieldDefs = getTaskNotesFields(typeDef);
	const taskNote = buildTask(typeDef, dto);
	taskNote[fieldDefs.id.key] = await generateTaskId(db, { project });

	const path = db.resolvePath(
		typeDef,
		fieldDefs,
		`${taskNote[fieldDefs.id.key]} ${taskNote[fieldDefs.title.key]}`,
	);

	const result = await db.collection.create({
		path,
		frontmatter: taskNote,
		body: "",
	});

	if (result.error) {
		throw new Error(result.error.message);
	}

	return fromTaskNote(fieldDefs, taskNote, path);
}
