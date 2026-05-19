import ms from "ms";

import { memo } from "@/lib/cache";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";
import { createClient, formatMailBoxes, type MailBoxFields } from "../lib";
import { INBOX } from "../lib/constants";
import { listBoxes } from "../lib/list-boxes";

const CACHE_TTL = ms("7d");
const CACHE_KEY = "ListBoxesQueryArgs";

type ListBoxesQueryArgs = {
	fields?: MailBoxFields[];
	format?: Format;
	pagination?: PaginationParams;
};
export const listBoxesQuery = memo(
	async function listBoxesQuery({
		fields = ["name", "path", "specialUse"],
		format = "md",
		pagination,
	}: ListBoxesQueryArgs = {}): Promise<string> {
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
