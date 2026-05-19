import { Mdbase } from "@/lib/providers/mdbase";
import { createTask, MDBASE_COLLECTION_ROOT } from "../lib";

type CreateTaskCommandArgs = {
  name: string;
};
export async function createTaskCommand({
  name,
}: CreateTaskCommandArgs): Promise<string> {
  const out = "";
  
  await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

  await createTask(db, { name });

  return out;
}
