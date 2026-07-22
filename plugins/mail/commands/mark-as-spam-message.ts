import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";

import { ImapClient, INBOX, markAsSpamMailMessage } from "../lib";

type MarkAsSpamMailMessageCommandArgs = {
	id: string;
};
export async function markAsSpamMailMessageCommand({
	id,
}: MarkAsSpamMailMessageCommandArgs): Promise<string> {
	const { t } = await getTranslations("mail");
	const out = "";

	const accessToken = getAccessToken();
	const user = getUser();

	await using imap = await ImapClient.open({
		user,
		accessToken,
	});
	await imap.lock(INBOX);

	await markAsSpamMailMessage(imap.client, { id });

	await cleanCache(["listUnreadMailsQuery"]);

	logEvent("MailMovedToSpam", {
		message: t("events.mailMovedToSpam"),
		properties: { id },
	});

	return out;
}
