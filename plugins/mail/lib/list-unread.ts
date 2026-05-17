import { type OrderFields, orderBy } from "@/lib/utils/order";
import {
	type Pagination,
	type PaginationParams,
	paginate,
} from "@/lib/utils/pagination";
import { type MailClient, type MailMessage, toMailMessage } from "./types";

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
	const { data: uuids, page } = paginate(unseenUids || [], params.pagination);

	if (uuids.length === 0) {
		return {
			data: [],
			page,
		};
	}

	const messages = (
		await client.fetchAll(
			uuids,
			{
				envelope: true,
				source: true,
			},
			{ uid: true },
		)
	).map(toMailMessage);

	return {
		data: orderBy(messages, [
			{
				key: "received",
				order: "desc",
			},
		]),
		page,
	};
}
