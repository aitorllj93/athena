import { ALL_SPECIAL_USE_FLAG } from "./constants";
import type { MailClient } from "./types";

type ArchiveMailParams = {
	id: string;
};
export async function archiveMail(
	client: MailClient,
	params: ArchiveMailParams,
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
