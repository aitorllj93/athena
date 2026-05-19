import { DisposableCollection } from "./collection";

type CompleteTaskParams = {
	name: string;
};
export async function completeTask({ name }: CompleteTaskParams) {
	await using db = await DisposableCollection.open();

	const existing = await db.collection.query({
		types: ["task"],
		where: `file.path == "${name}"`,
	});

	if (!existing) {
		throw new Error(`Task not found`);
	}

	await db.collection.update({
		path: name,
		fields: {
			status: "done",
		},
	});
}
