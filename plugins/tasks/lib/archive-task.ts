import type { Mdbase } from "@/lib/providers/mdbase";
import { TASK } from "./constants";

type CompleteTaskParams = {
	name: string;
};
export async function archiveTask(db: Mdbase, { name }: CompleteTaskParams) {
	const typeDef = await db.getType(TASK);
	const path = db.resolvePath(typeDef, name);
	const archivePath = db.resolveArchivePath(typeDef, name);
	if (!archivePath) {
		return;
	}

	await db.collection.rename({
		from: path,
		to: archivePath,
	});
}
