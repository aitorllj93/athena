import { SEEN_MESSAGE_FLAG } from "../boxes";
import type { MailClient } from "../client";

type MarkAsSeenMailMessageParams = {
	id: string;
};
export async function markAsSeenMailMessage(
	client: MailClient,
	params: MarkAsSeenMailMessageParams,
): Promise<void> {
	await client.messageFlagsAdd(params.id, [SEEN_MESSAGE_FLAG], { uid: true });
}
