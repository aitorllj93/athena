import { getTranslations } from "@/lib/i18n";
import { formatDistance } from "@/lib/utils/date";
import {
	type DisplayFieldDefinition,
	type Format,
	render,
} from "@/lib/utils/render";

import type { MailMessage, MailMessageFields } from "./types";

type FieldMap = {
	[K in MailMessageFields]: DisplayFieldDefinition<MailMessage, K>;
};

let columnDefs: DisplayFieldDefinition<MailMessage>[] | null = null;

async function getColumnDefs() {
  if (columnDefs) return columnDefs;

  const { t } = await getTranslations("mail");

  const columnDefsMap = new Map<MailMessageFields, FieldMap[MailMessageFields]>([
		[
			"subject",
			{ key: "subject", label: t("fields.subject"), format: (v) => `${v}` },
		],
		[
			"sender",
			{
				key: "sender",
				label: t("fields.sender"),
				format: (v) => (v.name ? `${v.name}<${v.address}>` : v.address),
			},
		],
		[
			"received",
			{
				key: "received",
				label: t("fields.received"),
				format: (v) => formatDistance(v),
			},
		],
		["id", { key: "id", label: t("fields.id"), format: (v) => `#${v}` }],
  ]);

  columnDefs = Array.from(columnDefsMap.values()) as DisplayFieldDefinition<MailMessage>[];
  return columnDefs;
}

export async function formatMailMessages(
	messages: MailMessage[],
	format?: Format,
	fields?: MailMessageFields[],
) {
  const colDefs = await getColumnDefs();
	return render(messages, {
		columnDefinitions: colDefs,
		fields: fields as MailMessageFields[],
		format,
	});
}
