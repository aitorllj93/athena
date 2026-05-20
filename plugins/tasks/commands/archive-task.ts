import { cleanCache } from "@/lib/cache";
import { getLogger } from "@/lib/logger";
import { Mdbase } from "@/lib/providers/mdbase";
import { archiveTask, MDBASE_COLLECTION_ROOT } from "../lib";

const logger = getLogger("events");

type ArchiveTaskCommandArgs = {
	name: string;
};
export async function archiveTaskCommand({
	name,
}: ArchiveTaskCommandArgs): Promise<string> {
	const out = "";

	await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

	const task = await archiveTask(db, { name });

	await cleanCache(["listScheduledTasksQuery"]);

	logger.info("TaskArchived", task);

	return out;
}
