import {
	type Pagination,
	type PaginationParams,
	paginate,
} from "@/lib/utils/pagination";
import { type OrderFields, orderBy } from "../utils/order";
import type { MailClient, MailMessage } from "./types";

type ListUnreadParams = {
	pagination?: PaginationParams;
	order?: OrderFields<MailMessage>;
};
export async function listUnreadMails(
	client: MailClient,
	params: ListUnreadParams,
): Promise<{
	data: MailMessage[];
	page: Pagination;
}> {
	const unseenUids = await client.search({ seen: false }, { uid: true });
	const { data: uuids, page } = paginate(
		unseenUids || [],
		params.pagination,
	);

	if (uuids.length === 0) {
		return {
			data: [],
			page,
		};
	}

	const messages = await client.fetchAll(
		uuids,
		{
			envelope: true,
			source: true,
		},
		{ uid: true },
	);

	return {
		data: orderBy(messages, [
			{
				key: "envelope.date",
				order: "desc",
			},
		]),
		page,
	};
}
