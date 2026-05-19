import { Mdbase } from "@/lib/providers/mdbase";
import { archiveTask, MDBASE_COLLECTION_ROOT } from "../lib";

type ArchiveTaskCommandArgs = {
  name: string;
};
export async function archiveTaskCommand({
  name,
}: ArchiveTaskCommandArgs): Promise<string> {
  const out = "";

  await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

  await archiveTask(db, { name });

  return out;
}
