import { createTask } from "../lib";

type CreateTaskCommandArgs = {
  name: string;
};
export async function createTaskCommand({
  name,
}: CreateTaskCommandArgs): Promise<string> {
  const out = "";

  await createTask({ name });

  return out;
}
