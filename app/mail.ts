import z from "zod";
import { listUnreadMailsCommand } from "@/commands/list-unread-mails";
import { procedure, router } from "@/lib/trpc";

const mail = router({
	inbox: procedure.query(async () => {
		return listUnreadMailsCommand();
	}),
	listUnread: procedure
		.input(z.object({ 
			limit: z.number().default(50),
			page: z.number().default(1), 
		}))
		.query(async ({ input }) => {
			return listUnreadMailsCommand({ 
				pagination: {
					limit: input.limit,
					page: input.page,
				}
			});
		}),
	markRead: procedure
		.input(z.object({ id: z.string() }))
		.mutation(({ input }) => {
			console.log(`Marcando como leído: ${input.id}`);
		}),
});

export default mail;
