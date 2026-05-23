import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import { createClient } from "../lib/client";
import { INBOX } from "../lib/constants";
import { spamMail } from "../lib/spam-mail";

type SpamMailCommandArgs = {
	id: string;
};
export async function spamMailCommand({
	id,
}: SpamMailCommandArgs): Promise<string> {
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
		await spamMail(mailClient, { id });
	} finally {
		lock.release();
	}

	await cleanCache(["listUnreadMailsQuery"]);

	await mailClient.logout();

	logEvent("MailMovedToSpam", {
		message: t("events.mailMovedToSpam"),
		properties: { id },
	});

	return out;
}
