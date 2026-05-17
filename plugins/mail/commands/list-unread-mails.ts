import ms from "ms";

import { memo } from "@/lib/cache";
import { getTranslations } from "@/lib/i18n";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";
import {
	createClient,
	formatMailMessages,
	listUnreadMails,
	type MailMessageFields,
} from "../lib";

const CACHE_TTL = ms("2h");
const CACHE_KEY = "listUnreadMailsCommand";

// biome-ignore lint/suspicious/noExplicitAny: i18n translation function
let translator: any = null;
async function getT() {
	if (translator) return translator;
	const { t } = await getTranslations("mail");
	translator = t;
	return t;
}

type ListUnreadMailCommandArgs = {
	fields?: MailMessageFields[];
	format?: Format;
	pagination?: PaginationParams;
};
export const listUnreadMailsCommand = memo(
	async function listUnreadMailsCommand({
		fields = ["received", "sender", "subject", "id"],
		format = "md",
		pagination,
	}: ListUnreadMailCommandArgs = {}): Promise<string> {
		let out = "";

		const t = await getT();

		const accessToken = getAccessToken();
		const user = getUser();

		const mailClient = createClient({
			user,
			accessToken,
		});

		await mailClient.connect();

		const lock = await mailClient.getMailboxLock("INBOX");

		try {
			const { data, page } = await listUnreadMails(mailClient, {
				pagination,
			});

			out += `${t("unreadCount", { total: page.total })}\n\n`;

			out += await formatMailMessages(data, format, fields);
		} finally {
			lock.release();
		}

		await mailClient.logout();

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
