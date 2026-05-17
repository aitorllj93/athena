import { procedure, router } from "@/lib/trpc";
import { getAddressCommand } from "./commands/get-address";

const map = router({
	address: procedure.query(async () => {
		return getAddressCommand();
	}),
});

export default map;
