import ms from "ms";

import { memo } from "@/lib/cache";
import { getTranslations } from "@/lib/i18n";
import {
	createClient,
	formatMailMessages,
	listUnreadMails,
	type MailMessageFields,
} from "@/lib/mail";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";

const { t } = await getTranslations("mail");

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

			out += formatMailMessages(data, format, fields);
		} finally {
			lock.release();
		}

		await mailClient.logout();

		return out;
	},
	ms("2h"),
);
