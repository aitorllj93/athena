import { getTranslations } from "@/lib/i18n";
import { formatDistance } from "@/lib/utils/date";
import {
	type DisplayFieldDefinition,
	type Format,
	render,
} from "@/lib/utils/render";

import type { MailMessage, MailMessageFields } from "./types";

const { t } = await getTranslations("mail");

type FieldMap = {
	[K in MailMessageFields]: DisplayFieldDefinition<MailMessage, K>;
};

const COLUMN_DEFS_MAP = new Map<MailMessageFields, FieldMap[MailMessageFields]>(
	[
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
	],
);
const COLUMN_DEFS = Array.from(
	COLUMN_DEFS_MAP.values(),
) as DisplayFieldDefinition<MailMessage>[];

export function formatMailMessages(
	messages: MailMessage[],
	format?: Format,
	fields?: MailMessageFields[],
) {
	return render(messages, {
		columnDefinitions: COLUMN_DEFS,
		fields: fields as MailMessageFields[],
		format,
	});
}
