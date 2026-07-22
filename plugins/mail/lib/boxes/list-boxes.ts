import { type OrderFields, orderBy } from "@/lib/utils/order";
import {
	type Pagination,
	type PaginationParams,
	paginate,
} from "@/lib/utils/pagination";
import type { MailClient } from "../client";
import { type MailBox, type MailBoxFields, toMailBox } from "./types";

type ListMailBoxesParams = {
	pagination?: PaginationParams;
	order?: OrderFields<MailBoxFields>;
};
export async function listMailBoxes(
	client: MailClient,
	params: ListMailBoxesParams,
): Promise<{
	data: MailBox[];
	page: Pagination;
}> {
	const boxes = (await client.list()).map(toMailBox);
	const { data, page } = paginate(boxes || [], params.pagination);

	return {
		data: orderBy(data, [
			{
				key: "path",
				order: "desc",
			},
		]),
		page,
	};
}
