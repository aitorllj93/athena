import type { Mdbase } from "@/lib/providers/mdbase";

type CompleteTaskParams = {
	name: string;
	archive?: boolean;
};
export async function completeTask(
	db: Mdbase,
	{ archive, name }: CompleteTaskParams,
) {
	const existing = await db.collection.query({
		types: ["task"],
		where: `file.path == "${name}"`,
	});

	if (!existing) {
		throw new Error(`Task not found`);
	}

	const typeDef = await db.getType("task");
	const path = db.resolvePath(typeDef, name);

	await db.collection.update({
		path,
		fields: {
			status: "done",
		},
	});

	if (archive) {
		const archivePath = db.resolveArchivePath(typeDef, name);
		if (!archivePath) {
			return;
		}

		await db.collection.rename({
			from: path,
			to: archivePath,
		});
	}
}
