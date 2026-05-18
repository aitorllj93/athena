import { SPAM_SPECIAL_USE_FLAG } from "./constants";
import type { MailClient } from "./types";

type SpamMailParams = {
  id: string;
};
export async function spamMail(
  client: MailClient,
  params: SpamMailParams,
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
