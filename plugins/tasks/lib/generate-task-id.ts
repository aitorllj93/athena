import type { Mdbase } from "@/lib/providers/mdbase";
import { generateProjectId } from "./generate-project-id";
import { listTasks } from "./list-tasks";
import type { Project } from "./types";

const DEFAULT_PREFIX = "TSK";

type GenerateTaskIdParams = {
	project?: Project;
};
export async function generateTaskId(
	db: Mdbase,
	{ project }: GenerateTaskIdParams,
): Promise<string> {
	let prefix = DEFAULT_PREFIX;
	let maxId = 0;

	const { data: previousTasks } = await listTasks(db, {
		filters: project
			? { projects: [project.name] }
			: { hasAnyProject: false },
		orderBy: {
			field: "dateCreated",
			direction: "desc",
		},
	});

	if (project) {
		prefix = project?.id ?? generateProjectId(project.name);
	}

	if (previousTasks) {
		for (const task of previousTasks) {
			if (!task.id) {
				continue;
			}
			const [pId, tId] = task.id.split("-");

			if (pId !== prefix) {
				continue;
			}

			if (!tId) {
				continue;
			}
			const taskNumb = parseInt(tId, 10);
			if (taskNumb > maxId) {
				maxId = taskNumb;
			}
		}
	}

	return `${prefix}-${maxId + 1}`;
}
