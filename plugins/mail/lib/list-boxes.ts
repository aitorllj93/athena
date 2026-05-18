import { type OrderFields, orderBy } from "@/lib/utils/order";
import {
	type Pagination,
	type PaginationParams,
	paginate,
} from "@/lib/utils/pagination";
import {
	type MailBox,
	type MailBoxFields,
	type MailClient,
	toMailBox
} from "./types";

type ListBoxesParams = {
	pagination?: PaginationParams;
	order?: OrderFields<MailBoxFields>;
};
export async function listBoxes(
	client: MailClient,
	params: ListBoxesParams,
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
