import ms from "ms";

import { memo } from "@/lib/cache";
import { getTranslations } from "@/lib/i18n";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";

import {
	formatMailMessages,
	ImapClient,
	INBOX,
	listUnreadMailMessages,
	type MailMessageFields,
} from "../lib";

const DEFAULT_LIMIT = 10;

const CACHE_TTL = ms("2h");
const CACHE_KEY = "listUnreadMailsQuery";

type ListUnreadMailMessagesQueryArgs = {
	box?: string;
	fields?: MailMessageFields[];
	format?: Format;
	pagination?: PaginationParams;
};
export const listUnreadMailMessagesQuery = memo(
	async function listUnreadMailMessagesQuery({
		box = INBOX,
		fields = ["received", "sender", "subject", "id"],
		format = "md",
		pagination = { limit: DEFAULT_LIMIT },
	}: ListUnreadMailMessagesQueryArgs = {}): Promise<string> {
		let out = "";

		const { t } = await getTranslations("mail");

		const accessToken = getAccessToken();
		const user = getUser();

		await using imap = await ImapClient.open({
			user,
			accessToken,
		});

		await imap.lock(box);

		const { data, page } = await listUnreadMailMessages(imap.client, {
			pagination,
		});

		if (format === "json") {
			return JSON.stringify({ data, page });
		}

		out += `${t("unreadCount", { total: page.total })}\n\n`;

		out += await formatMailMessages(data, format, fields);

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
