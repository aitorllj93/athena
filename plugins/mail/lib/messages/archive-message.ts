import { ALL_SPECIAL_USE_FLAG } from "../boxes";
import type { MailClient } from "../client";

type ArchiveMailMessageParams = {
	id: string;
};
export async function archiveMailMessage(
	client: MailClient,
	params: ArchiveMailMessageParams,
): Promise<void> {
	let archivePath: string | null = null;
	const boxes = await client.list();
	for (const mailbox of boxes) {
		if (mailbox.specialUse === ALL_SPECIAL_USE_FLAG) {
			archivePath = mailbox.path;
			break;
		}
	}
	if (archivePath) {
		await client.messageMove({ uid: params.id }, archivePath);
	}
}
