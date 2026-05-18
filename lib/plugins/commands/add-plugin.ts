import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findProjectRoot } from "@/lib/utils/workspace";

export function addPlugin(pluginName: string) {
	const rootDir = findProjectRoot();
	const localPluginPath = join(rootDir, "plugins", pluginName);
	const isLocal = existsSync(localPluginPath);

	const packageJsonPath = join(rootDir, "package.json");
	const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

	const depName = `athena-plugin-${pluginName}`;

	if (isLocal) {
		console.log(`Installing local plugin: ${pluginName} (workspace:*)...`);

		// 1. Declaratively add the workspace reference to package.json
		pkg.dependencies = pkg.dependencies || {};
		pkg.dependencies[depName] = "workspace:*";
		writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), "utf-8");

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
}
