import ms from "ms";
import { memo } from "@/lib/cache";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { Format } from "@/lib/utils/render";
import { formatMailMessages, INBOX, type MailMessageFields, openMailMessage } from "../lib";
import { ImapClient } from "../lib/client";

const CACHE_TTL = ms("7d");
const CACHE_KEY = "openMailQuery";

type OpenMailMessageQueryArgs = {
	id: string;
	fields?: MailMessageFields[];
	format?: Format;
};
export const openMailMessageQuery = memo(
	async function openMailMessageQuery({
		id,
		fields = ["subject", "sender", "received", "body"],
		format = "mdlist",
	}: OpenMailMessageQueryArgs): Promise<string> {
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

		if (!mail) {
			throw new Error(`Mail with id "${id}" not found`);
		}

		if (format === "json") {
			return JSON.stringify(mail);
		}

		out += await formatMailMessages([mail], format, fields);

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
