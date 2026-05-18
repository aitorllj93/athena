import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findProjectRoot } from "@/lib/utils/workspace";

export function removePlugin(pluginName: string) {
	const rootDir = findProjectRoot();
	const packageJsonPath = join(rootDir, "package.json");
	const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

	const depName = `athena-plugin-${pluginName}`;
	const isInstalled =
		pkg.dependencies?.[depName] || pkg.devDependencies?.[depName];

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

	writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), "utf-8");

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
}
