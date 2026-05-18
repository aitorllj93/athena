import ms from "ms";
import { memo } from "@/lib/cache";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { Format } from "@/lib/utils/render";
import {
	archiveMail,
	formatMailMessages,
	type MailMessageFields,
	markAsSeenMail,
	openMail,
} from "../lib";
import { createClient } from "../lib/client";
import { INBOX } from "../lib/constants";

const CACHE_TTL = ms("1s");
const CACHE_KEY = "readMailCommand";

type ReadMailCommandArgs = {
	id: string;
	archive?: boolean;
	fields?: MailMessageFields[];
	format?: Format;
};
export const readMailCommand = memo(
	async function readMailCommand({
		id,
		archive = true,
		fields = ["subject", "sender", "received", "body"],
		format = "mdlist",
	}: ReadMailCommandArgs): Promise<string> {
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
			await markAsSeenMail(mailClient, { id });
			if (archive) {
				await archiveMail(mailClient, { id });
			}

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
