import type { ListResponse } from "imapflow";
import type { DeepKeys } from "@/lib/utils/object";
import type { SpecialUseFlag } from "./constants";

export type MailBox = {
	name: string;
	parentPath: string;
	path: string;
	specialUse?: SpecialUseFlag;
};
export type MailBoxFields = DeepKeys<MailBox>;

export function toMailBox(box: ListResponse): MailBox {
	return {
		name: box.name,
		parentPath: box.parentPath,
		path: box.path,
		specialUse: box.specialUse as SpecialUseFlag,
	};
}
