import { simpleParser } from "mailparser";
import { type MailClient, type MailMessage, toMailMessage } from "./types";

type OpenParams = {
	id: string;
};
export async function openMail(
	client: MailClient,
	params: OpenParams,
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
