import i18nextInstance, { type i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";

type Language = "en" | "es";
type Namespace = "auth" | "common";

// Share the i18next default instance globally across bundled/unbundled boundaries
const globalI18nKey = "__athena_i18next_instance__";
// biome-ignore lint/suspicious/noExplicitAny: register on globalThis for shared ESM instance
if (!(globalThis as any)[globalI18nKey]) {
	// biome-ignore lint/suspicious/noExplicitAny: register on globalThis for shared ESM instance
	(globalThis as any)[globalI18nKey] = i18nextInstance;
}
// biome-ignore lint/suspicious/noExplicitAny: register on globalThis for shared ESM instance
const i18next = (globalThis as any)[globalI18nKey] as typeof i18nextInstance;

const translations: Record<
	Language,
	Record<Namespace, () => Promise<unknown>>
> = {
	es: {
		auth: () =>
			import("locales/es/auth.json", {
				with: { type: "json" },
			}),
		common: () =>
			import("locales/es/common.json", {
				with: { type: "json" },
			}),
	},
	en: {
		auth: () =>
			import("locales/en/auth.json", {
				with: { type: "json" },
			}),
		common: () =>
			import("locales/en/common.json", {
				with: { type: "json" },
			}),
	},
};

function detectLanguage() {
	const lang = process.env.LC_ALL || process.env.LANG || "en";
	return lang.split(".")[0]?.split("_")[0] || "en";
}

// Only initialize once on the shared instance
if (!i18next.isInitialized) {
	await i18next
		.use(
			resourcesToBackend((language: Language, namespace: Namespace) =>
				translations[language]?.[namespace]?.(),
			),
		)
		.init({
			lng: detectLanguage(),
			fallbackLng: "en",
			defaultNS: "common",
			ns: ["common"],
			partialBundledLanguages: true,
			preload: ["en"],
			interpolation: {
				escapeValue: false,
			},
		});
}

export default i18next;

const loaded = new Set<string>();

type GetTranslationsOptions = {
	namespaces?: string[];
	keyPrefix?: string;
};

async function ensureNamespaces(namespaces: string[]) {
	const currentLang = i18next.language || "en";

	const toLoad = namespaces.filter((ns) => {
		if (loaded.has(ns)) return false;

		// Only skip backend fetching if the namespace has already been loaded in the CURRENT active language.
		// Do not check fallback languages like "en" here, otherwise we will skip loading the actual system language.
		if (i18next.hasResourceBundle(currentLang, ns)) {
			loaded.add(ns);
			return false;
		}

		return true;
	});

	if (toLoad.length === 0) return;

	await i18next.loadNamespaces(toLoad);

	for (const ns of toLoad) {
		loaded.add(ns);
	}
}

export function getLanguage() {
	return i18next.language;
}

export type TFnOptions = { defaultValue?: string; ns?: string };
export type TFn = (
	key: string,
	opts?: TFnOptions & Record<string, unknown>,
) => string;

export async function getTranslations(
	defaultNamespace: string,
	options: GetTranslationsOptions = {},
): Promise<{
	t: TFn;
	i18n: i18n;
}> {
	const namespaces = Array.from(
		new Set([defaultNamespace, ...(options.namespaces ?? [])]),
	);
	await ensureNamespaces(namespaces);

	const keyPrefix = options.keyPrefix;

	function t(key: string, opts?: TFnOptions): string {
		// Explicit namespace override: "common:retry"
		if (key.includes(":")) {
			return i18next.t(key, opts) as string;
		}

		const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key;

		return i18next.t(
			`${opts?.ns ?? defaultNamespace}:${fullKey}`,
			opts,
		) as string;
	}

	return {
		t,
		i18n: i18next,
	};
}
