import { TRASH_SPECIAL_USE_FLAG } from "../boxes";
import type { MailClient } from "../client";

type DeleteMailMessageParams = {
  id: string;
};
export async function deleteMailMessage(
  client: MailClient,
  params: DeleteMailMessageParams,
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
