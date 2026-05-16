import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";

function detectLanguage() {
	const lang = process.env.LC_ALL || process.env.LANG || "en";

	return lang.split(".")[0]?.split("_")[0];
}

await i18next
	.use(
		resourcesToBackend(
			(language: string, namespace: string) =>
				import(`locales/${language}/${namespace}.json`, {
					with: { type: "json" },
				}),
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