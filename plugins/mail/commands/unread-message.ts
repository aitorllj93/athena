import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { Format } from "@/lib/utils/render";

import {
  formatMailMessages,
  ImapClient,
  INBOX,
  type MailMessageFields,
  markAsUnSeenMailMessage,
  openMailMessage
} from "../lib";

type UnreadMailMessageCommandArgs = {
  id: string;
  fields?: MailMessageFields[];
  format?: Format;
};
export async function unreadMailMessageCommand({
  id,
  fields = ["subject", "sender", "received", "body"],
  format = "mdlist",
}: UnreadMailMessageCommandArgs): Promise<string> {
  const { t } = await getTranslations("mail");

  let out = "";

  const accessToken = getAccessToken();
  const user = getUser();

  await using imap = await ImapClient.open({
    user,
    accessToken,
  });
  await imap.lock(INBOX);

  const mail = await openMailMessage(imap.client, {
    id,
  });

  await markAsUnSeenMailMessage(imap.client, { id });

  if (!mail) {
    throw new Error(`Mail with id "${id}" not found`);
  }

  out += await formatMailMessages([mail], format, fields);

  await cleanCache(["listUnreadMailsQuery"]);

  logEvent("MailUnread", {
    message: t("events.mailUnread"),
    properties: { id },
  });

  return out;
}
