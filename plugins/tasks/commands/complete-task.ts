import { cleanCache } from "@/lib/cache";
import { getLogger } from "@/lib/logger";
import { Mdbase } from "@/lib/providers/mdbase";
import { completeTask, MDBASE_COLLECTION_ROOT } from "../lib";

const logger = getLogger("events");

type CompleteTaskCommandArgs = {
	archive?: boolean;
	name: string;
};
export async function completeTaskCommand({
	archive,
	name,
}: CompleteTaskCommandArgs): Promise<string> {
	const out = "";

	await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

	const task = await completeTask(db, { archive, name });

	await cleanCache(["listScheduledTasksQuery"]);

	logger.info("TaskCompleted", task);

	return out;
}
