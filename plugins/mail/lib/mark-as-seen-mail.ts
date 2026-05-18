import { SEEN_MESSAGE_FLAG } from "./constants";
import type { MailClient } from "./types";

type MarkAsSeenMailParams = {
	id: string;
};
export async function markAsSeenMail(
	client: MailClient,
	params: MarkAsSeenMailParams,
): Promise<void> {
	await client.messageFlagsAdd(params.id, [SEEN_MESSAGE_FLAG], { uid: true });
}
