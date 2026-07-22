import { PluginRegistry } from "@/lib/plugins/registry";
import { router } from "@/lib/trpc";
import { cacheRouter } from "./cache";
import { pluginsRouter } from "./plugins";

/**
 * Dynamically builds the main tRPC router.
 * Registers the core 'plugin' command group and attaches all loaded plugins' sub-routers.
 */
export function createAppRouter() {
	// biome-ignore lint/suspicious/noExplicitAny: router properties are dynamically registered sub-routers
	const routes: Record<string, any> = {
		cache: cacheRouter,
		plugin: pluginsRouter,
	};

	// Inject each dynamically loaded plugin's router
	const loadedPlugins = PluginRegistry.getPlugins();
	for (const plugin of loadedPlugins) {
		routes[plugin.name] = plugin.router;
	}

	return router(routes);
}

// Export a base router type for CLI compiler and tooling type safety
const baseRouter = router({
	cache: cacheRouter,
	plugin: pluginsRouter,
});
export type AppRouter = typeof baseRouter;
