import type { MailClient } from "../client";
import { simpleParser } from "../parse";
import { type MailMessage, toMailMessage } from "./types";

type OpenMailMessageParams = {
	id: string;
};
export async function openMailMessage(
	client: MailClient,
	params: OpenMailMessageParams,
): Promise<MailMessage | null> {
	const message = await client.fetchOne(
		params.id,
		{
			envelope: true,
			source: true,
		},
		{ uid: true },
	);

	// biome-ignore lint/complexity/useOptionalChain: message is falsy value
	if (!message || !message.source) {
		return null;
	}

	const mailMessage = toMailMessage(message);
	mailMessage.body = await simpleParser(message.source);

	return mailMessage;
}
