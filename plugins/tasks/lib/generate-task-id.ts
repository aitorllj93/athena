import type { Mdbase } from "@/lib/providers/mdbase";
import { generateProjectId } from "./generate-project-id";
import { getProject } from "./get-project";
import { listProjectTasks } from "./list-project-tasks";
import type { Task } from "./types";

const DEFAULT_PREFIX = "TSK";

type GenerateTaskIdParams = {
	projectName?: string;
};
export async function generateTaskId(
	db: Mdbase,
	{ projectName }: GenerateTaskIdParams,
): Promise<string> {
	let prefix = DEFAULT_PREFIX;
	let maxId = 0;
	let previousTasks: Task[] | undefined;

	if (projectName) {
		const project = await getProject(db, {
			projectName,
		}).catch(() => null);
		prefix = project?.id ?? generateProjectId(projectName);

		const { data } = await listProjectTasks(db, { projectName });
		previousTasks = data;
	} else {
		throw new Error("Method not implemented");
		// Find prefixed by DEFAULT_PREFIX
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
