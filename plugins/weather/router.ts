import { procedure, router } from "@/lib/trpc";
import { getForecastCommand } from "./commands/get-forecast";

const weather = router({
	forecast: procedure.query(async () => {
		return getForecastCommand();
	}),
});

export default weather;
