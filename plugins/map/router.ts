import { procedure, router } from "@/lib/trpc";

import { getAddressQuery } from "./queries";

const map = router({
	address: procedure
		.meta({
			description: "Display the current coordinates address information",
		})
		.query(async () => {
			return getAddressQuery();
		}),
});

export default map;
