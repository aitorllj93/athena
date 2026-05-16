import { getForecastCommand } from "@/commands/get-forecast";
import { procedure, router } from "@/lib/trpc";

const weather = router({
	forecast: procedure.query(async () => {
		return getForecastCommand();
	}),
});

export default weather;
