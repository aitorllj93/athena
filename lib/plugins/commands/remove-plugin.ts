import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getTranslations } from "@/lib/i18n";
import { findProjectRoot } from "@/lib/utils/workspace";
import { generateManifest } from "../manifest-generator";

export async function removePlugin(pluginName: string) {
	const { t } = await getTranslations("common", {
		keyPrefix: "plugins"
	});

	const rootDir = findProjectRoot();
	const packageJsonPath = join(rootDir, "package.json");
	const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

	const depName = `athena-plugin-${pluginName}`;
	const isInstalled =
		pkg.dependencies?.[depName] || pkg.devDependencies?.[depName];

	if (!isInstalled) {
		return t("pluginIsNotInstalled", {
			pluginName
		})
	}

	console.log(t(
		"removingPlugin",
		{
			pluginName,
			depName
		}
	));

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
		generateManifest();
		return t("pluginRemoved", {
			pluginName
		})
	} catch (error) {
		throw new Error(t("failedRemoving", {
			reason: (error as Error).message
		}));
	}
}
