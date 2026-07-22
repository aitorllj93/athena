import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";

import { archiveMailMessage, ImapClient, INBOX } from "../lib";

type ArchiveMailMessageCommandArgs = {
	id: string;
};
export async function archiveMailMessageCommand({
	id,
}: ArchiveMailMessageCommandArgs): Promise<string> {
	const { t } = await getTranslations("mail");
	const out = "";

	const accessToken = getAccessToken();
	const user = getUser();

	await using imap = await ImapClient.open({
		user,
		accessToken,
	});
	await imap.lock(INBOX);

	await archiveMailMessage(imap.client, { id });

	await cleanCache(["listUnreadMailsQuery"]);

	logEvent("MailArchived", {
		message: t("events.mailArchived"),
		properties: { id },
	});

	return out;
}
