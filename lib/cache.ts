import crypto from "node:crypto";
import cacache from "cacache";
import stringify from "fast-json-stable-stringify";

import { CACHE_DIR, DEFAULT_CACHE_TTL } from "./constants";

export function memo<TArgs extends unknown[], TResult>(
	fn: (...args: TArgs) => Promise<TResult>,
	ttlMs = DEFAULT_CACHE_TTL,
	keyPrefix?: string,
) {
	if (!keyPrefix) {
		console.warn(`WARNING: keyPrefix not found, falling back to \`fn.name\` "${fn.name}" this behavior might fail on compilation builds`);
	}
	return async (...args: TArgs): Promise<TResult> => {
		const key = crypto
			.createHash("sha1")
			.update((keyPrefix ?? fn.name) + stringify(args))
			.digest("hex");

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
