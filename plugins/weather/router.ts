import { procedure, router } from "@/lib/trpc";
import { getForecastCommand } from "./commands/get-forecast";

const weather = router({
	forecast: procedure
		.meta({
			description: "Display the forecast for today"
		})
		.query(async () => {
			return getForecastCommand();
		}),
});

export default weather;
