import { DEFAULT_FORMAT } from "@/lib/constants";
import type { Format } from "@/lib/types";
import { formatDistance } from "@/lib/utils/date";

import type { MailMessage } from "./types";

function formatXML(message: MailMessage) {
	return `<mail>
  <uid>${message.uid}</uid>
  <subject>${message.envelope?.subject?.trim()}</subject>
  <date>${message.envelope?.date}</date>
  <from>${message.envelope?.from?.[0]?.name}<${message.envelope?.from?.[0]?.address}></from>
</mail>`;
}

function formatRegular(message: MailMessage) {
  const date = message.envelope?.date;
  const fromName = message.envelope?.from?.[0]?.name;
  const fromAddress = message.envelope?.from?.[0]?.address;
  const subject = message.envelope?.subject?.trim();

	return `${formatDistance(date)}: ${fromName}<${fromAddress}>: ${subject} (ID: ${message.uid})`;
}

function formatMinimal(message: MailMessage) {
	return `${formatDistance(message.envelope?.date)}: ${message.envelope?.from?.[0]?.name}<${message.envelope?.from?.[0]?.address}>: ${message.envelope?.subject?.trim()}`;
}

export function formatMailMessage(message: MailMessage, format: Format = DEFAULT_FORMAT) {
  if (format === "xml") {
    return formatXML(message);
  }

  if (format === "regular") {
    return formatRegular(message);
  }

	return formatMinimal(message);
}
