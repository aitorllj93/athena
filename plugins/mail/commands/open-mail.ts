import ms from "ms";
import { memo } from "@/lib/cache";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { Format } from "@/lib/utils/render";
import { formatMailMessages, type MailMessageFields, openMail } from "../lib";
import { createClient } from "../lib/client";
import { INBOX } from "../lib/constants";

const CACHE_TTL = ms("7d");
const CACHE_KEY = "openMailCommand";

type OpenMailCommandArgs = {
	id: string;
	fields?: MailMessageFields[];
	format?: Format;
};
export const openMailCommand = memo(
	async function openMailCommand({
		id,
		fields = ["subject", "sender", "received", "body"],
		format = "mdlist",
	}: OpenMailCommandArgs): Promise<string> {
		let out = "";

		const accessToken = getAccessToken();
		const user = getUser();

		const mailClient = createClient({
			user,
			accessToken,
		});

		await mailClient.connect();

		const lock = await mailClient.getMailboxLock(INBOX);

		try {
			const mail = await openMail(mailClient, {
				id,
			});

			if (!mail) {
				throw new Error(`Mail with id "${id}" not found`);
			}

			out += await formatMailMessages([mail], format, fields);
		} finally {
			lock.release();
		}

		await mailClient.logout();

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
