import { cleanCache } from "@/lib/cache";
import { getLogger } from "@/lib/logger";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import { archiveMail } from "../lib/archive-mail";
import { createClient } from "../lib/client";
import { INBOX } from "../lib/constants";

const logger = getLogger("events");

type ArchiveMailCommandArgs = {
	id: string;
};
export async function archiveMailCommand({
	id,
}: ArchiveMailCommandArgs): Promise<string> {
	const out = "";

	const accessToken = getAccessToken();
	const user = getUser();

	const mailClient = createClient({
		user,
		accessToken,
	});

	await mailClient.connect();

	const lock = await mailClient.getMailboxLock(INBOX);

	try {
		await archiveMail(mailClient, { id });
	} finally {
		lock.release();
	}

	await cleanCache(["listUnreadMailsQuery"]);

	await mailClient.logout();

	logger.info("ArchivedMail", { id });

	return out;
}
