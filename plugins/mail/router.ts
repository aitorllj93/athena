import z from "zod";
import { datatypes } from "@/app/common";
import { procedure, router } from "@/lib/trpc";
import { archiveMailCommand } from "./commands/archive-mail";
import { deleteMailCommand } from "./commands/delete-mail";
import { listBoxesCommand } from "./commands/list-boxes";
import { listUnreadMailsCommand } from "./commands/list-unread-mails";
import { openMailCommand } from "./commands/open-mail";
import { readMailCommand } from "./commands/read-mail";
import { spamMailCommand } from "./commands/spam-mail";
import type { MailBoxFields, MailMessageFields } from "./lib";
import { INBOX } from "./lib/constants";

const mail = router({
	inbox: procedure
		.meta({
			description: "List unread messages",
		})
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
			}),
		)
		.query(async ({ input }) => {
			return listUnreadMailsCommand({
				fields: input.fields as MailMessageFields[],
				format: input.format,
			});
		}),
	boxes: router({
		list: procedure
			.meta({
				default: true,
				description: "List mail boxes",
			})
			.input(
				z.object({
					fields: datatypes.fields,
					format: datatypes.format.default("mdtable"),
					limit: datatypes.limit.default(50),
					page: datatypes.page,
				}),
			)
			.query(async ({ input }) => {
				return listBoxesCommand({
					fields: input.fields as MailBoxFields[],
					format: input.format,
					pagination: {
						limit: input.limit,
						page: input.page,
					},
				});
			}),
	}),
	listUnread: procedure
		.meta({
			description: "List unread messages",
		})
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				box: z.string().default(INBOX),
				limit: datatypes.limit.default(50),
				page: datatypes.page,
			}),
		)
		.query(async ({ input }) => {
			return listUnreadMailsCommand({
				box: input.box,
				fields: input.fields as MailMessageFields[],
				format: input.format,
				pagination: {
					limit: input.limit,
					page: input.page,
				},
			});
		}),
	open: procedure
		.meta({
			description: "Display a message",
		})
		.input(
			z.tuple([
				z.string().describe("messageId"),
				z.object({
					fields: datatypes.fields,
					format: datatypes.format.default("mdlist"),
				}),
			]),
		)
		.query(async ({ input: [messageId, opts] }) => {
			return openMailCommand({
				id: messageId,
				fields: opts.fields as MailMessageFields[],
				format: opts.format,
			});
		}),
	read: procedure
		.meta({
			description: "Display a message, mark it as Seen and Archive it",
		})
		.input(
			z.tuple([
				z.string().describe("messageId"),
				z.object({
					fields: datatypes.fields,
					format: datatypes.format.default("mdlist"),
				}),
			]),
		)
		.mutation(({ input: [messageId, opts] }) => {
			return readMailCommand({
				id: messageId,
				fields: opts.fields as MailMessageFields[],
				format: opts.format,
			});
		}),
	archive: procedure
		.meta({
			description: "Archive a message",
		})
		.input(z.tuple([z.string().describe("messageId")]))
		.mutation(({ input: [messageId] }) => {
			return archiveMailCommand({
				id: messageId,
			});
		}),
	delete: procedure
		.meta({
			description: "Move a message to Trash",
		})
		.input(z.tuple([z.string().describe("messageId")]))
		.mutation(({ input: [messageId] }) => {
			return deleteMailCommand({
				id: messageId,
			});
		}),
	spam: procedure
		.meta({
			description: "Move a message to Spam",
		})
		.input(z.tuple([z.string().describe("messageId")]))
		.mutation(({ input: [messageId] }) => {
			return spamMailCommand({
				id: messageId,
			});
		}),
});

export default mail;
