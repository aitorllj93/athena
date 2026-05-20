import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getTranslations } from "@/lib/i18n";
import { findProjectRoot } from "@/lib/utils/workspace";

export async function addPlugin(pluginName: string) {
	const { t } = await getTranslations("common", {
		keyPrefix: "plugins"
	});
	const rootDir = findProjectRoot();
	const localPluginPath = join(rootDir, "plugins", pluginName);
	const isLocal = existsSync(localPluginPath);

	const packageJsonPath = join(rootDir, "package.json");
	const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

	const depName = `athena-plugin-${pluginName}`;

	if (isLocal) {
		console.log(
			t("installingLocal", {
				pluginName,
			}),
		);

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
			return t("installed", {
				pluginName
			});
		} catch (error) {
			throw new Error(
				t("failedInstalligLocal", { reason: (error as Error).message }),
			);
		}
	} else {
		console.log(t("installingDynamic", {
			depName: depName
		}));
		try {
			// External npm plugin install
			execSync(`bun add ${depName}`, {
				cwd: rootDir,
				stdio: "inherit",
			});
			return t("installed", {
				pluginName
			});
		} catch (error) {
			throw new Error(
				t("failedInstallingDynamic", { reason: (error as Error).message }),
			);
		}
	}
}
