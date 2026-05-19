import { procedure, router } from "@/lib/trpc";
import { getAddressCommand } from "./commands/get-address";

const map = router({
	address: procedure
		.meta({
			description: "Display the current coordinates address information",
		})
		.query(async () => {
			return getAddressCommand();
		}),
});

export default map;
