import { cleanCache } from "@/lib/cache";
import { Mdbase } from "@/lib/providers/mdbase";
import { MDBASE_COLLECTION_ROOT, updateTask } from "../lib";

type UpdateTaskCommandArgs = {
	name: string;
	title?: string;
	priority?: string;
	due?: string;
	scheduled?: string;
	contexts?: string[];
	projects?: string[];
	timeEstimate?: number;
};
export async function updateTaskCommand(
	args: UpdateTaskCommandArgs,
): Promise<string> {
	const out = "";

	await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

	await updateTask(db, args);

	await cleanCache(["listScheduledTasksQuery"]);

	return out;
}
