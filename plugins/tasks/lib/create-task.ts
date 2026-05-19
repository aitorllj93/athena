import type { Mdbase } from "@/lib/providers/mdbase";

type CreateTaskParams = {
	name: string;
};
export async function createTask(db: Mdbase, { name }: CreateTaskParams) {
	const typeDef = await db.getType("task");

	const frontmatter: Record<string, unknown> = {
		type: "task",
	};
	Object.entries(typeDef.fields ?? {}).forEach(([k, v]) => {
		if (v.computed) {
			return;
		}

		if (v.default) {
			frontmatter[k] = v.default;
		}
	});

	await db.collection.create({
		path: db.resolvePath(typeDef, name),
		frontmatter,
		body: "",
	});
}
