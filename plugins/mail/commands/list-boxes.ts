import ms from "ms";

import { memo } from "@/lib/cache";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";
import { createClient, formatMailBoxes, type MailBoxFields } from "../lib";
import { INBOX } from "../lib/constants";
import { listBoxes } from "../lib/list-boxes";

const CACHE_TTL = ms("1s");
const CACHE_KEY = "listBoxesCommand";

type ListBoxesCommandArgs = {
	fields?: MailBoxFields[];
	format?: Format;
	pagination?: PaginationParams;
};
export const listBoxesCommand = memo(
	async function listBoxesCommand({
		fields = ["name", "path", "specialUse"],
		format = "md",
		pagination,
	}: ListBoxesCommandArgs = {}): Promise<string> {
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
			const { data } = await listBoxes(mailClient, {
				pagination,
			});

			out += await formatMailBoxes(data, format, fields);
		} finally {
			lock.release();
		}

		await mailClient.logout();

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
