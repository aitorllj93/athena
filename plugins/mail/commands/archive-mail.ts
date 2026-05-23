import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import { archiveMail } from "../lib/archive-mail";
import { createClient } from "../lib/client";
import { INBOX } from "../lib/constants";

type ArchiveMailCommandArgs = {
	id: string;
};
export async function archiveMailCommand({
	id,
}: ArchiveMailCommandArgs): Promise<string> {
	const { t } = await getTranslations("mail");
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

	logEvent("MailArchived", {
		message: t("events.mailArchived"),
		properties: { id }
	})

	return out;
}
