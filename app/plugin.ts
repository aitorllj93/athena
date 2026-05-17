import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import z from "zod";
import { PluginRegistry } from "@/lib/plugins/registry";
import { procedure, router } from "@/lib/trpc";
import { findProjectRoot } from "@/lib/utils/workspace";

export const pluginRouter = router({
	list: procedure.query(async () => {
		const plugins = PluginRegistry.getPlugins();
		if (plugins.length === 0) {
			return "No plugins installed. Try running: athena plugin add calendar";
		}
		return plugins.map((p) => ({
			plugin: p.name,
			commands: Object.keys(p.commands || {}),
		}));
	}),
	add: procedure
		.input(z.string().describe("pluginName"))
		.mutation(async ({ input }) => {
			const pluginName = input;
			const rootDir = findProjectRoot();
			const localPluginPath = path.join(rootDir, "plugins", pluginName);
			const isLocal = fs.existsSync(localPluginPath);

			const packageJsonPath = path.join(rootDir, "package.json");
			const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
			
			const depName = `athena-plugin-${pluginName}`;

			if (isLocal) {
				console.log(`Installing local plugin: ${pluginName} (workspace:*)...`);
				
				// 1. Declaratively add the workspace reference to package.json
				pkg.dependencies = pkg.dependencies || {};
				pkg.dependencies[depName] = "workspace:*";
				fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), "utf-8");

				try {
					// 2. Run bun install to link workspaces and update the lockfile cleanly
					execSync("bun install", {
						cwd: rootDir,
						stdio: "inherit",
					});
					return `Plugin "${pluginName}" successfully installed!`;
				} catch (error) {
					throw new Error(
						`Failed to link workspace plugin: ${(error as Error).message}`,
					);
				}
			} else {
				console.log(`Installing dynamic plugin: ${depName}...`);
				try {
					// External npm plugin install
					execSync(`bun add ${depName}`, {
						cwd: rootDir,
						stdio: "inherit",
					});
					return `Plugin "${pluginName}" successfully installed!`;
				} catch (error) {
					throw new Error(
						`Failed to install dynamic plugin: ${(error as Error).message}`,
					);
				}
			}
		}),
	remove: procedure
		.input(z.string().describe("pluginName"))
		.mutation(async ({ input }) => {
			const pluginName = input;
			const rootDir = findProjectRoot();
			const packageJsonPath = path.join(rootDir, "package.json");
			const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

			const depName = `athena-plugin-${pluginName}`;
			const isInstalled = pkg.dependencies?.[depName] || pkg.devDependencies?.[depName];

			if (!isInstalled) {
				return `Plugin "${pluginName}" is not installed.`;
			}

			console.log(`Removing plugin: ${pluginName} (${depName})...`);

			// 1. Declaratively remove the dependency from package.json
			if (pkg.dependencies?.[depName]) {
				delete pkg.dependencies[depName];
			}
			if (pkg.devDependencies?.[depName]) {
				delete pkg.devDependencies[depName];
			}

			fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), "utf-8");

			try {
				// 2. Run bun install to update node_modules and regenerate the lockfile cleanly
				execSync("bun install", {
					cwd: rootDir,
					stdio: "inherit",
				});
				return `Plugin "${pluginName}" successfully removed!`;
			} catch (error) {
				throw new Error(`Failed to remove plugin: ${(error as Error).message}`);
			}
		}),
});

export default pluginRouter;
