import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { getLanguage } from "@/lib/i18n";
import { findProjectRoot } from "@/lib/utils/workspace";
import type { Plugin } from "./registry";

class PluginRepositoryClass {
	/**
	 * Returns all available plugins
	 */
	getAvailablePlugins() {
		return this.getLocallyAvailablePlugins();
	}

	getLocallyAvailablePlugins(): Plugin[] {
		const rootDir = findProjectRoot();
		const localPluginsDir = join(rootDir, "plugins");

		const localPlugins = readdirSync(localPluginsDir, { withFileTypes: true });

		const results: Plugin[] = [];
		for (const dirent of localPlugins) {
			if (dirent.isFile()) {
				continue;
			}

			const pluginDir = join(localPluginsDir, dirent.name);

			const plugin = this.getPluginFromPath(pluginDir);

			if (plugin) {
				results.push(plugin);
			}
		}

		return results;
	}

	getPluginFromPath(path: string): Plugin | null {
		const pluginPackagePath = join(path, "package.json");
		const isValidPlugin = existsSync(pluginPackagePath);

		if (!isValidPlugin) {
			return null;
		}

		let languagePath: string | null = join(
			path,
			"locales",
			`${getLanguage()}.json`,
		);

		if (!existsSync(languagePath)) {
			// Fallback to english
			languagePath = join(path, "locales", "en.json");
			if (!existsSync(languagePath)) {
				languagePath = null;
			}
		}

		const pkg = JSON.parse(readFileSync(pluginPackagePath, "utf-8"));
		const translations = languagePath
			? JSON.parse(readFileSync(languagePath, "utf-8"))
			: null;

		const plugin = {
			name: basename(path),
			pkgName: pkg.name,
			version: pkg.version,
			displayName: translations?.displayName,
			description: translations?.description ?? pkg.description,
		} as Plugin;

		return plugin;
	}
}

export const PluginRepository = new PluginRepositoryClass();