import z from "zod";
import { clean } from "@/lib/cache";
import { procedure, router } from "@/lib/trpc";

export const cacheRouter = router({
	clean: procedure
		.input(
			z
				.string()
				.transform((value) => value.split(",").map((item) => item.trim()))
				.optional()
				.describe("cacheKeys"),
		)
		.query(async ({ input }) => {
			await clean(input);
		}),
});
