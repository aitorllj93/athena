import { SPAM_SPECIAL_USE_FLAG } from "../boxes";
import type { MailClient } from "../client";

type MarkAsSpamMailMessageParams = {
  id: string;
};
export async function markAsSpamMailMessage(
  client: MailClient,
  params: MarkAsSpamMailMessageParams,
): Promise<void> {
  let spamPath: string | null = null;
  const boxes = await client.list();
  for (const mailbox of boxes) {
    if (mailbox.specialUse === SPAM_SPECIAL_USE_FLAG) {
      spamPath = mailbox.path;
      break;
    }
  }
  if (spamPath) {
    await client.messageMove({ uid: params.id }, spamPath);
  }
}
