import crypto from "node:crypto";
import { rm } from "node:fs/promises";
import cacache from "cacache";
import stringify from "fast-json-stable-stringify";
import { CACHE_DIR, DEFAULT_CACHE_TTL } from "./constants";

type MemoOptions = {
	skipCache?: boolean;
};

export function memo<TArgs extends unknown[], TResult>(
	fn: (...args: TArgs) => Promise<TResult>,
	ttlMs = DEFAULT_CACHE_TTL,
	keyPrefix?: string,
) {
	if (!keyPrefix) {
		console.warn(
			`WARNING: keyPrefix not found, falling back to \`fn.name\` "${fn.name}" this behavior might fail on compilation builds`,
		);
	}
	return async (
		...params: [...TArgs, MemoOptions?]
	): Promise<TResult> => {
		const maybeOptions = params.at(-1);

		const hasOptions =
			typeof maybeOptions === "object" &&
			maybeOptions !== null &&
			"skipCache" in maybeOptions;

		const options = hasOptions
			? (maybeOptions as MemoOptions)
			: undefined;

		const args = (hasOptions
			? params.slice(0, -1)
			: params) as TArgs;

		const key = crypto
			.createHash("sha1")
			.update((keyPrefix ?? fn.name) + stringify(args))
			.digest("hex");

		if (options?.skipCache) {
			const result = await fn(...args);
			return result;
		}

		try {
			const entry = await cacache.get.info(CACHE_DIR, key);
			if (entry && Date.now() - entry.time < ttlMs) {
				const { data } = await cacache.get(CACHE_DIR, key);
				return JSON.parse(data.toString()) as TResult;
			}
		} catch {
			// cache miss
		}

		const result = await fn(...args);
		await cacache.put(CACHE_DIR, key, JSON.stringify(result));
		return result;
	};
}

export async function clean(keys?: string[]) {
	if (keys) {
		for (const key of keys) {
			await cacache.rm(CACHE_DIR, key);
		}
	} else {
		await rm(CACHE_DIR, {
			force: true,
			recursive: true,
		});
	}
}
