import i18next from "@/lib/i18n";
import type { DeepKeys } from "../utils/object";

export interface Plugin {
	name: string;
	pkgName?: string;
	displayName?: string;
	description?: string;
	version?: string;
	installed?: boolean;
	isLocal?: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: tRPC router type can be complex and dynamic
	router: any;
	// biome-ignore lint/suspicious/noExplicitAny: commands are executable functions with any signature
	commands?: Record<string, (...args: any[]) => any>;
	// Map of language (e.g. 'en', 'es') to translations object
	locales?: Record<
		PropertyKey,
		Record<PropertyKey, string | Record<PropertyKey, string>> | unknown
	>;
}
export type PluginFields = DeepKeys<Plugin>;

class PluginRegistryClass {
	private plugins = new Map<string, Plugin>();
	private commands = new Map<string, (...args: unknown[]) => unknown>();

	/**
	 * Registers a plugin in the global registry.
	 * Registers its commands and injects its local translations into i18next.
	 */
	register(plugin: Plugin) {
		plugin.installed = true;
		this.plugins.set(plugin.name, plugin);

		// Register cross-plugin commands
		if (plugin.commands) {
			for (const [name, cmd] of Object.entries(plugin.commands)) {
				this.commands.set(`${plugin.name}.${name}`, cmd);
			}
		}

		// Register translation bundles dynamically
		if (plugin.locales) {
			for (const [lng, resources] of Object.entries(plugin.locales)) {
				i18next.addResourceBundle(lng, plugin.name, resources, true, true);
			}
		}
	}

	/**
	 * Returns all loaded plugins.
	 */
	getPlugins() {
		return Array.from(this.plugins.values());
	}

	/**
	 * Returns all registered command names.
	 */
	getCommandNames() {
		return Array.from(this.commands.keys());
	}

	/**
	 * Retrieves a specific command by its fully qualified name (e.g. "calendar.listUpcomingEvents")
	 */
	getCommand(fullName: string) {
		return this.commands.get(fullName);
	}

	/**
	 * Runs a command from a plugin dynamically. Useful for cross-plugin cooperation.
	 */
	// biome-ignore lint/suspicious/noExplicitAny: return type can be anything returned by the command
	async runCommand<T = any>(fullName: string, ...args: any[]): Promise<T> {
		const cmd = this.commands.get(fullName);
		if (!cmd) {
			throw new Error(
				`Command "${fullName}" not found. Is the plugin installed and loaded?`,
			);
		}
		return cmd(...args) as T;
	}
}

const globalRegistryKey = "__athena_plugin_registry__";
// biome-ignore lint/suspicious/noExplicitAny: globalThis
if (!(globalThis as any)[globalRegistryKey]) {
	// biome-ignore lint/suspicious/noExplicitAny: globalThis
	(globalThis as any)[globalRegistryKey] = new PluginRegistryClass();
}

// biome-ignore lint/suspicious/noExplicitAny: globalThis
export const PluginRegistry = (globalThis as any)[
	globalRegistryKey
] as PluginRegistryClass;
