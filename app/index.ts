
import { router } from "@/lib/trpc";

import calendar from "./calendar";
import mail from "./mail";
import map from "./map";
import morning from "./morning";
import weather from "./weather";

const app = router({
	calendar,
	mail,
	map,
	morning,
	weather,
});

export type AppRouter = typeof app;

export default app;
