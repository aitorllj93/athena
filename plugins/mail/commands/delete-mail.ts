import { cleanCache } from "@/lib/cache";
import { getLogger } from "@/lib/logger";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import { createClient } from "../lib/client";
import { INBOX } from "../lib/constants";
import { deleteMail } from "../lib/delete-mail";

const logger = getLogger("events");

type DeleteMailCommandArgs = {
	id: string;
};
export async function deleteMailCommand({
	id,
}: DeleteMailCommandArgs): Promise<string> {
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
		await deleteMail(mailClient, { id });
	} finally {
		lock.release();
	}

	await cleanCache(["listUnreadMailsQuery"]);

	await mailClient.logout();

	logger.info("DeletedMail", { id });

	return out;
}
