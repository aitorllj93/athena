import z from "zod";
import { listUnreadMailsCommand } from "@/commands/list-unread-mails";
import type { MailMessageFields } from "@/lib/mail";
import { procedure, router } from "@/lib/trpc";

import { datatypes } from "./common";

const mail = router({
	inbox: procedure
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
	listUnread: procedure
		.input(
			z.object({
				fields: datatypes.fields,
				format: datatypes.format,
				limit: datatypes.limit.default(50),
				page: datatypes.page,
			}),
		)
		.query(async ({ input }) => {
			return listUnreadMailsCommand({
				fields: input.fields as MailMessageFields[],
				format: input.format,
				pagination: {
					limit: input.limit,
					page: input.page,
				},
			});
		}),
	markRead: procedure
		.input(z.object({ id: z.string() }))
		.mutation(({ input }) => {
			console.log(`Marcando como leído: ${input.id}`);
		}),
});

export default mail;
