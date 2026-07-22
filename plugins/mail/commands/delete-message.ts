import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";

import { deleteMailMessage, ImapClient, INBOX } from "../lib";

type DeleteMailMessageCommandArgs = {
	id: string;
};
export async function deleteMailMessageCommand({
	id,
}: DeleteMailMessageCommandArgs): Promise<string> {
	const { t } = await getTranslations("mail");
	const out = "";

	const accessToken = getAccessToken();
	const user = getUser();

	await using imap = await ImapClient.open({
		user,
		accessToken,
	});
	await imap.lock(INBOX);

	await deleteMailMessage(imap.client, { id });

	await cleanCache(["listUnreadMailsQuery"]);

	logEvent("MailDeleted", {
		message: t("events.mailDeleted"),
		properties: { id },
	});

	return out;
}
