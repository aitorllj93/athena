import { morningBriefCommand } from "@/commands/morning-brief";

import { procedure, router } from "@/lib/trpc";

const morning = router({
	brief: procedure.query(async () => {
		return morningBriefCommand();
	}),
});

export default morning;
