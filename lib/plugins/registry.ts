import i18next from "@/lib/i18n";

export interface AthenaPlugin {
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: tRPC router type can be complex and dynamic
  router: any;
  // biome-ignore lint/suspicious/noExplicitAny: commands are executable functions with any signature
  commands?: Record<string, (...args: any[]) => any>;
  // Map of language (e.g. 'en', 'es') to translations object
  locales?: Record<string, Record<string, string | Record<string, string>>>;
}

class PluginRegistryClass {
  private plugins = new Map<string, AthenaPlugin>();
  private commands = new Map<string, (...args: unknown[]) => unknown>();

  /**
   * Registers a plugin in the global registry.
   * Registers its commands and injects its local translations into i18next.
   */
  register(plugin: AthenaPlugin) {
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
  async runCommand(fullName: string, ...args: any[]): Promise<any> {
    const cmd = this.commands.get(fullName);
    if (!cmd) {
      throw new Error(`Command "${fullName}" not found. Is the plugin installed and loaded?`);
    }
    return cmd(...args);
  }
}

const globalRegistryKey = "__athena_plugin_registry__";
// biome-ignore lint/suspicious/noExplicitAny: globalThis
if (!(globalThis as any)[globalRegistryKey]) {
	// biome-ignore lint/suspicious/noExplicitAny: globalThis
	(globalThis as any)[globalRegistryKey] = new PluginRegistryClass();
}

// biome-ignore lint/suspicious/noExplicitAny: globalThis
export const PluginRegistry = (globalThis as any)[globalRegistryKey] as PluginRegistryClass;
