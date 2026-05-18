import ms from "ms";
import { memo } from "@/lib/cache";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import { archiveMail } from "../lib/archive-mail";
import { createClient } from "../lib/client";
import { INBOX } from "../lib/constants";

const CACHE_TTL = ms("1s");
const CACHE_KEY = "archiveMailCommand";

type ArchiveMailCommandArgs = {
	id: string;
};
export const archiveMailCommand = memo(
	async function deleteMailCommand({
		id,
	}: ArchiveMailCommandArgs): Promise<string> {
		const out = "";

		const accessToken = getAccessToken();
		const user = getUser();

		const mailClient = createClient({
			user,
			accessToken,
		});

		await mailClient.connect();

		const lock = await mailClient.getMailboxLock(INBOX);

		try {
			await archiveMail(mailClient, { id });
		} finally {
			lock.release();
		}

		await mailClient.logout();

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
