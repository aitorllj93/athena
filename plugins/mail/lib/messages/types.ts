import type { FetchMessageObject } from "imapflow";
import type { DeepKeys } from "@/lib/utils/object";

import type { ParsedMail } from "../parse";

export type MailMessage = {
	id: number;
	messageId?: string;
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

export function toMailMessage(fetchMessage: FetchMessageObject): MailMessage {
	const subject = fetchMessage.envelope?.subject;

	return {
		id: fetchMessage.uid,
		messageId: fetchMessage.envelope?.messageId,
		received: fetchMessage.envelope?.date,
		sender: {
			name: fetchMessage.envelope?.from?.[0]?.name,
			address: fetchMessage.envelope?.from?.[0]?.address ?? "",
		},
		subject,
		source: fetchMessage.source?.toString(),
	};
}
