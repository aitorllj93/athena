import { Mdbase } from "@/lib/providers/mdbase";
import { completeTask, MDBASE_COLLECTION_ROOT } from "../lib";

type CompleteTaskCommandArgs = {
	name: string;
};
export async function completeTaskCommand({
	name,
}: CompleteTaskCommandArgs): Promise<string> {
	const out = "";

	await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

	await completeTask(db, { name });

	return out;
}
