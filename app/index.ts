
import { router } from "@/lib/trpc";

import calendar from "./calendar";
import mail from "./mail";
import morning from "./morning";
import weather from "./weather";

const app = router({
	calendar,
	mail,
	morning,
	weather,
});

export type AppRouter = typeof app;

export default app;
