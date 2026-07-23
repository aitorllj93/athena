import { SEEN_MESSAGE_FLAG } from "../boxes";
import type { MailClient } from "../client";

type MarkAsUnSeenMailMessageParams = {
  id: string;
};
export async function markAsUnSeenMailMessage(
  client: MailClient,
  params: MarkAsUnSeenMailMessageParams,
): Promise<void> {
  await client.messageFlagsRemove(params.id, [SEEN_MESSAGE_FLAG], { uid: true });
}
