import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";

type Language = "en" | "es";
type Namespace = "auth" | "calendar" | "common" | "mail" | "morning" | "tasks" | "weather";

const translations: Record<Language, Record<Namespace, any>> = {
	es: {
		auth: () =>
			import("locales/es/auth.json", {
				with: { type: "json" },
			}),
		calendar: () =>
			import("locales/es/calendar.json", {
				with: { type: "json" },
			}),
		common: () =>
			import("locales/es/common.json", {
				with: { type: "json" },
			}),
		mail: () =>
			import("locales/es/mail.json", {
				with: { type: "json" },
			}),
		morning: () =>
			import("locales/es/morning.json", {
				with: { type: "json" },
			}),
		tasks: () =>
			import("locales/es/tasks.json", {
				with: { type: "json" },
			}),
		weather: () =>
			import("locales/es/weather.json", {
				with: { type: "json" },
			}),
	},
	en: {
		auth: () =>
			import("locales/en/auth.json", {
				with: { type: "json" },
			}),
		calendar: () =>
			import("locales/en/calendar.json", {
				with: { type: "json" },
			}),
		common: () =>
			import("locales/en/common.json", {
				with: { type: "json" },
			}),
		mail: () =>
			import("locales/en/mail.json", {
				with: { type: "json" },
			}),
		morning: () =>
			import("locales/en/morning.json", {
				with: { type: "json" },
			}),
		tasks: () =>
			import("locales/en/tasks.json", {
				with: { type: "json" },
			}),
		weather: () =>
			import("locales/en/weather.json", {
				with: { type: "json" },
			}),
	},
}


function detectLanguage() {
	const lang = process.env.LC_ALL || process.env.LANG || "en";

	return lang.split(".")[0]?.split("_")[0];
}

await i18next
	.use(
		resourcesToBackend(
			(language: Language, namespace: Namespace) =>
				translations[language]?.[namespace]?.()
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

export default i18next;

const loaded = new Set<string>();

type GetTranslationsOptions = {
  namespaces?: string[];
  keyPrefix?: string;
};

async function ensureNamespaces(namespaces: string[]) {
  const toLoad = namespaces.filter((ns) => !loaded.has(ns));

  if (toLoad.length === 0) return;

  await i18next.loadNamespaces(toLoad);

  toLoad.forEach((ns) => {
    loaded.add(ns);
  });
}

export function getLanguage() {
  return i18next.language;
}

export async function getTranslations(
  defaultNamespace: string,
  options: GetTranslationsOptions = {},
) {
  const namespaces = Array.from(
    new Set([
      defaultNamespace,
      ...(options.namespaces ?? []),
    ]),
  );
  await ensureNamespaces(namespaces);

  const keyPrefix = options.keyPrefix;

  function t(
    key: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    opts?: any,
  ): string {

    // namespace explícito override: "common:retry"
    if (key.includes(":")) {
      return i18next.t(key, opts) as string;
    }

    const fullKey = keyPrefix
      ? `${keyPrefix}.${key}`
      : key;

    return i18next.t(
      `${defaultNamespace}:${fullKey}`,
      opts,
    ) as string;
  };

  return {
    t,
    i18n: i18next,
  }
}