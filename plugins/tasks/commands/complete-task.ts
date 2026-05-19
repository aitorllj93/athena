import { cleanCache } from "@/lib/cache";
import { Mdbase } from "@/lib/providers/mdbase";
import { completeTask, MDBASE_COLLECTION_ROOT } from "../lib";

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

	await completeTask(db, { archive, name });

	await cleanCache(["listScheduledTasksQuery"]);

	return out;
}
