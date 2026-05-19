import z from "zod";
import { cleanCache } from "@/lib/cache";
import { procedure, router } from "@/lib/trpc";

export const cacheRouter = router({
	clean: procedure
		.meta({
			description: "Clean the cache"
		})
		.input(
			z
				.string()
				.transform((value) => value.split(",").map((item) => item.trim()))
				.optional()
				.describe("cacheKeys"),
		)
		.query(async ({ input }) => {
			await cleanCache(input);
		}),
});
