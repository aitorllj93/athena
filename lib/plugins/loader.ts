import fs from "node:fs";
import path from "node:path";
import { findProjectRoot } from "@/lib/utils/workspace";
import { activePlugins } from "./manifest";
import { PluginRegistry } from "./registry";

function getTargetNamespace(args: string[]): string | null {
	// In compiled standalone binaries, args[1] is the first arg.
	// In direct script run, args[1] is the path to the script (cli.ts/cli.js), so the first arg is args[2].
	const firstArgIndex = (args[1] && (args[1].endsWith(".ts") || args[1].endsWith(".js") || path.isAbsolute(args[1])))
		? 2
		: 1;

	for (let i = firstArgIndex; i < args.length; i++) {
		const arg = args[i] as string;
		if (!arg.startsWith("-")) {
			return arg;
		}
	}
	return null;
}

/**
 * Dynamically discover and load active plugins.
 * Only the plugin matching the requested CLI namespace is loaded at startup.
 * If help is requested, all plugins are loaded to display full command specifications.
 */
export async function loadPlugins() {
	const namespace = getTargetNamespace(process.argv);
	const loadAll = !namespace || namespace === "help" || namespace === "plugin";

	// 1. Identify which plugins we should load
	const pluginsToLoad = activePlugins.filter(
		(p) => loadAll || p.name === namespace,
	);

	const registeredPkgNames = new Set<string>();

	// 2. Load manifest plugins
	for (const { module, pkgName, isLocal } of pluginsToLoad) {
		try {
			// Call the dynamic import wrapper function
			const pluginModule = await module();
			// biome-ignore lint/suspicious/noExplicitAny: dynamic module
			const plugin = (pluginModule as any).default || pluginModule;
			plugin.isLocal = isLocal;

			if (plugin?.name && plugin.router) {
				PluginRegistry.register(plugin);
				registeredPkgNames.add(pkgName);
			} else {
				console.warn(
					`[Plugins] Invalid plugin structure for dependency: ${pkgName}`,
				);
			}
		} catch (error) {
			console.error(
				`[Plugins] Failed to load plugin dependency "${pkgName}":`,
				error,
			);
		}
	}

	// 3. Dynamic fallback loader for newly added/external plugins not yet in manifest
	const rootDir = findProjectRoot();
	const packageJsonPath = path.join(rootDir, "package.json");

	if (!fs.existsSync(packageJsonPath)) {
		return;
	}

	try {
		const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
		const deps = {
			...(pkg.dependencies || {}),
			...(pkg.devDependencies || {}),
		};

		const pluginDeps = Object.entries(deps).filter(([name]) => {
			if (!(name.startsWith("athena-plugin-") || name.startsWith("@athena/plugin-"))) {
				return false;
			}
			if (registeredPkgNames.has(name)) {
				return false;
			}
			const shortName = name.startsWith("athena-plugin-")
				? name.replace("athena-plugin-", "")
				: name.replace("@athena/plugin-", "");
			return loadAll || shortName === namespace;
		});

		for (const [depName, depValue] of pluginDeps) {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: dynamic module
				let pluginModule: any;

				try {
					pluginModule = await import(depName);
				} catch {
					const absolutePath = path.join(rootDir, "node_modules", depName);
					pluginModule = await import(absolutePath);
				}

				const plugin = pluginModule.default || pluginModule;
				plugin.isLocal = depValue === "workspace:*";

				if (plugin?.name && plugin.router) {
					PluginRegistry.register(plugin);
				} else {
					console.warn(
						`[Plugins] Invalid plugin structure for dynamic dependency: ${depName}`,
					);
				}
			} catch (importError) {
				console.error(
					`[Plugins] Failed to dynamically load plugin dependency "${depName}":`,
					importError,
				);
			}
		}
	} catch (error) {
		console.error(`[Plugins] Failed to parse package.json for fallback:`, error);
	}
}
