import he from "he";
import EmailReplyParser from "node-email-reply-parser";

import { getTranslations } from "@/lib/i18n";
import { formatDistance } from "@/lib/utils/date";
import {
	type DisplayFieldDefinition,
	type Format,
	render,
} from "@/lib/utils/render";

import { SPECIAL_USE_EMOJIS } from "./constants";
import type {
	MailBox,
	MailBoxFields,
	MailMessage,
	MailMessageFields,
} from "./types";

type FieldMap = {
	[K in MailMessageFields]: DisplayFieldDefinition<MailMessage, K>;
};
type BoxFieldMap = {
	[K in MailBoxFields]: DisplayFieldDefinition<MailBox, K>;
};

let columnDefs: DisplayFieldDefinition<MailMessage>[] | null = null;

let boxColumnDefs: DisplayFieldDefinition<MailBox>[] | null = null;

async function getColumnDefs() {
	if (columnDefs) return columnDefs;

	const { t } = await getTranslations("mail");

	const columnDefsMap = new Map<MailMessageFields, FieldMap[MailMessageFields]>(
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
			[
				"body",
				{
					key: "body",
					label: t("fields.body"),
					format: (v) => {
						if (!v) return "";
						const body = EmailReplyParser(v.text ?? "").getVisibleText();

						return he.decode(body);
					},
				},
			],
		],
	);

	columnDefs = Array.from(
		columnDefsMap.values(),
	) as DisplayFieldDefinition<MailMessage>[];
	return columnDefs;
}

async function getBoxColumnDefs() {
	if (boxColumnDefs) return boxColumnDefs;

	const { t } = await getTranslations("mail");

	const columnDefsMap = new Map<MailBoxFields, BoxFieldMap[MailBoxFields]>([
		["name", { key: "name", label: t("fields.name") }],
		["path", { key: "path", label: t("fields.path") }],
		[
			"specialUse",
			{
				key: "specialUse",
				label: t("fields.specialUse"),
				format(v) {
					return v ? (SPECIAL_USE_EMOJIS[v] ?? "") : "";
				},
			},
		],
	]);

	boxColumnDefs = Array.from(
		columnDefsMap.values(),
	) as DisplayFieldDefinition<MailBox>[];
	return boxColumnDefs;
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

export async function formatMailBoxes(
	boxes: MailBox[],
	format?: Format,
	fields?: MailBoxFields[],
) {
	const boxColumnDefs = await getBoxColumnDefs();
	return render(boxes, {
		columnDefinitions: boxColumnDefs,
		fields: fields as MailBoxFields[],
		format,
	});
}
