import fs from "node:fs";
import path from "node:path";
import { findProjectRoot } from "@/lib/utils/workspace";
import { PluginRegistry } from "./registry";

/**
 * Scans package.json in the project root, dynamically imports all dependencies
 * that match athena-plugin-* or @athena/plugin-*, and registers them in the PluginRegistry.
 */
export async function loadPlugins() {
	const rootDir = findProjectRoot();
	const packageJsonPath = path.join(rootDir, "package.json");

	if (!fs.existsSync(packageJsonPath)) {
		console.warn(`[Plugins] package.json not found at ${packageJsonPath}`);
		return;
	}

	try {
		const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
		const deps = {
			...(pkg.dependencies || {}),
			...(pkg.devDependencies || {}),
		};

		const pluginDeps = Object.entries(deps).filter(
			([name]) =>
				name.startsWith("athena-plugin-") || name.startsWith("@athena/plugin-"),
		);

		for (const [depName, depValue] of pluginDeps) {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: dynamically loaded ES module
				let pluginModule: any;

				try {
					// 1. Try standard dynamic import (ideal for dev bun run mode)
					pluginModule = await import(depName);
				} catch {
					// 2. Fall back to absolute host path import (critical for compiled standalone binary)
					const absolutePath = path.join(rootDir, "node_modules", depName);
					pluginModule = await import(absolutePath);
				}

				const plugin = pluginModule.default || pluginModule;
				plugin.isLocal = depValue === "workspace:*";

				if (plugin?.name && plugin.router) {
					PluginRegistry.register(plugin);
				} else {
					console.warn(
						`[Plugins] Invalid plugin structure for dependency: ${depName}`,
					);
				}
			} catch (importError) {
				console.error(
					`[Plugins] Failed to load plugin dependency "${depName}":`,
					importError,
				);
			}
		}
	} catch (error) {
		console.error(`[Plugins] Failed to parse package.json:`, error);
	}
}
