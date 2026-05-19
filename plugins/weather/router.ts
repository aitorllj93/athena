import { procedure, router } from "@/lib/trpc";
import { getForecastQuery } from "./queries";

const weather = router({
	forecast: procedure
		.meta({
			description: "Display the forecast for today"
		})
		.query(async () => {
			return getForecastQuery();
		}),
});

export default weather;
