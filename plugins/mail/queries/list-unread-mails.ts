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
import { INBOX } from "../lib/constants";

const CACHE_TTL = ms("2h");
const CACHE_KEY = "listUnreadMailsQuery";

type ListUnreadMailQueryArgs = {
	box?: string;
	fields?: MailMessageFields[];
	format?: Format;
	pagination?: PaginationParams;
};
export const listUnreadMailsQuery = memo(
	async function listUnreadMailsQuery({
		box = INBOX,
		fields = ["received", "sender", "subject", "id"],
		format = "md",
		pagination,
	}: ListUnreadMailQueryArgs = {}): Promise<string> {
		let out = "";

		const { t } = await getTranslations("mail");

		const accessToken = getAccessToken();
		const user = getUser();

		const mailClient = createClient({
			user,
			accessToken,
		});

		await mailClient.connect();

		const lock = await mailClient.getMailboxLock(box);

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
