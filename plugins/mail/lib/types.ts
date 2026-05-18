import type { FetchMessageObject, ImapFlow, ListResponse } from "imapflow";
import type { ParsedMail } from "mailparser";
import type { DeepKeys } from "@/lib/utils/object";
import type { SpecialUseFlag } from "./constants";

export type MailClient = ImapFlow;

export type MailBox = {
	name: string;
	parentPath: string;
	path: string;
	specialUse?: SpecialUseFlag;
};
export type MailBoxFields = DeepKeys<MailBox>;

export type MailMessage = {
	id: number;
	sender: {
		name?: string;
		address: string;
	};
	subject?: string;
	received?: Date;
	source?: string;
	body?: ParsedMail;
};
export type MailMessageFields = DeepKeys<MailMessage>;


export function toMailBox(box: ListResponse): MailBox {
	return {
		name: box.name,
		parentPath: box.parentPath,
		path: box.path,
		specialUse: box.specialUse as SpecialUseFlag,
	};
}

export function toMailMessage(fetchMessage: FetchMessageObject): MailMessage {
	const subject = fetchMessage.envelope?.subject;

	return {
		id: fetchMessage.uid,
		received: fetchMessage.envelope?.date,
		sender: {
			name: fetchMessage.envelope?.from?.[0]?.name,
			address: fetchMessage.envelope?.from?.[0]?.address ?? "",
		},
		subject,
		source: fetchMessage.source?.toString(),
	};
}
