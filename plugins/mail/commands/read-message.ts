import { cleanCache } from "@/lib/cache";
import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { Format } from "@/lib/utils/render";

import {
	archiveMailMessage,
	formatMailMessages,
	ImapClient,
	INBOX,
	type MailMessageFields,
	markAsSeenMailMessage,
	openMailMessage
} from "../lib";

type ReadMailMessageCommandArgs = {
	id: string;
	archive?: boolean;
	fields?: MailMessageFields[];
	format?: Format;
};
export async function readMailMessageCommand({
	id,
	archive = true,
	fields = ["subject", "sender", "received", "body"],
	format = "mdlist",
}: ReadMailMessageCommandArgs): Promise<string> {
	const { t } = await getTranslations("mail");

	let out = "";

	const accessToken = getAccessToken();
	const user = getUser();

	await using imap = await ImapClient.open({
		user,
		accessToken,
	});
	await imap.lock(INBOX);

	const mail = await openMailMessage(imap.client, {
		id,
	});

	await markAsSeenMailMessage(imap.client, { id });
	
	if (archive) {
		await archiveMailMessage(imap.client, { id });
	}

	if (!mail) {
		throw new Error(`Mail with id "${id}" not found`);
	}

	out += await formatMailMessages([mail], format, fields);

	await cleanCache(["listUnreadMailsQuery"]);

	logEvent("MailRead", {
		message: t("events.mailRead"),
		properties: { id },
	});

	return out;
}
