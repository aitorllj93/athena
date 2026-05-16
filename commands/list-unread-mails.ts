import ms from "ms";
import { memo } from "@/lib/cache";
import { getTranslations } from "@/lib/i18n";
import { createClient, formatMailMessage, listUnreadMails } from "@/lib/mail";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { PaginationParams } from "@/lib/utils/pagination";

const { t } = await getTranslations("mail");

type ListUnreadMailCommandArgs = {
	pagination?: PaginationParams;
};

export const listUnreadMailsCommand = memo(
	async function listUnreadMailsCommand({
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

			for (const message of data) {
				out += `${formatMailMessage(message)}\n`;
			}
		} finally {
			lock.release();
		}

		await mailClient.logout();

		return out;
	},
	ms("2h"),
);
