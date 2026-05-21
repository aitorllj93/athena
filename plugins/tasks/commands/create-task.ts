import { cleanCache } from "@/lib/cache";
import { getLogger } from "@/lib/logger";
import { Mdbase } from "@/lib/providers/mdbase";
import { createTask, MDBASE_COLLECTION_ROOT } from "../lib";

const logger = getLogger("events");

type CreateTaskCommandArgs = {
	name: string;
	title?: string;
	priority?: string;
	due?: string;
	scheduled?: string;
	contexts?: string[];
	projects?: string[];
	timeEstimate?: number;
};
export async function createTaskCommand(
	args: CreateTaskCommandArgs,
): Promise<string> {
	let out = "";

	await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

	const task = await createTask(db, args);

	out += task.id;

	await cleanCache(["listScheduledTasksQuery"]);

	logger.info("TaskCreated", task);

	return out;
}
