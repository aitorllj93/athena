import z from "zod";
import { datatypes } from "@/app/common";
import { procedure, router } from "@/lib/trpc";

import {
	archiveMailCommand,
	deleteMailCommand,
	readMailCommand,
	spamMailCommand,
} from "./commands";
import type { MailBoxFields, MailMessageFields } from "./lib";
import { INBOX } from "./lib/constants";
import { listBoxesQuery, listUnreadMailsQuery, openMailQuery } from "./queries";

const mail = router({
	inbox: procedure
		.meta({
			description: "List unread messages",
		})
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				skipCache: z.boolean().optional(),
			}),
		)
		.query(async ({ input }) => {
			return listUnreadMailsQuery(
				{
					fields: input.fields as MailMessageFields[],
					format: input.format,
				},
				{
					skipCache: input.skipCache,
				},
			);
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
				return listBoxesQuery({
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
				skipCache: z.boolean().optional(),
			}),
		)
		.query(async ({ input }) => {
			return listUnreadMailsQuery(
				{
					box: input.box,
					fields: input.fields as MailMessageFields[],
					format: input.format,
					pagination: {
						limit: input.limit,
						page: input.page,
					},
				},
				{
					skipCache: input.skipCache,
				},
			);
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
			return openMailQuery({
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
