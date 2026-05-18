import { TRASH_SPECIAL_USE_FLAG } from "./constants";
import type { MailClient } from "./types";

type DeleteMailParams = {
  id: string;
};
export async function deleteMail(
  client: MailClient,
  params: DeleteMailParams,
): Promise<void> {
  let deletePath: string | null = null;
  const boxes = await client.list();
  for (const mailbox of boxes) {
    if (mailbox.specialUse === TRASH_SPECIAL_USE_FLAG) {
      deletePath = mailbox.path;
      break;
    }
  }
  if (deletePath) {
    await client.messageMove({ uid: params.id }, deletePath);
  }
}
