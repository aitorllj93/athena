import { DisposableCollection } from "./collection";

type CreateTaskParams = {
  name: string;
};
export async function createTask({ name }: CreateTaskParams) {
  await using db = await DisposableCollection.open();

  await db.collection.create({
    type: "task",
    path: name
  });
}
