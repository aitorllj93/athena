import ms from "ms";

import { memo } from "@/lib/cache";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";
import {
	formatMailBoxes,
	ImapClient,
	listMailBoxes,
	type MailBoxFields,
} from "../lib";

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

		await using imap = await ImapClient.open({
			user,
			accessToken,
		});

		const { data } = await listMailBoxes(imap.client, {
			pagination,
		});

		if (format === "json") {
			return JSON.stringify({ data });
		}

		out += await formatMailBoxes(data, format, fields);

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
