import { type OrderFields, orderBy } from "@/lib/utils/order";
import {
	type Pagination,
	type PaginationParams,
	paginate,
} from "@/lib/utils/pagination";
import type { MailClient } from "../client";
import { getUnseenThreadsMessageUids } from "./get-unseen-threads-message-uids";
import { type MailMessage, toMailMessage } from "./types";

type ListUnreadMailMessagesParams = {
	pagination?: PaginationParams;
	order?: OrderFields<MailMessage>;
};
export async function listUnreadMailMessages(
	client: MailClient,
	params: ListUnreadMailMessagesParams,
): Promise<{
	data: MailMessage[];
	page: Pagination;
}> {
	const unseenUids = await getUnseenThreadsMessageUids(client);

	if (unseenUids.length === 0) {
		return {
			data: [],
			page: paginate([], params.pagination).page,
		};
	}

	const { data: uuids, page } = paginate(unseenUids || [], params.pagination);

	const messages = (
		await client.fetchAll(
			uuids,
			{
				envelope: true,
			},
			{ uid: true },
		)
	).map(toMailMessage);

	return {
		data: orderBy(messages, [
			{
				key: "received",
				order: "asc",
			},
		]),
		page,
	};
}
