#!/usr/bin/env bun

import "@/lib/utils/workspace";

import { writeFile } from "node:fs/promises";
import { createCli } from "trpc-cli";
import type { CommandJSON } from "trpc-cli/dist/json";
import { loadPlugins } from "@/lib/plugins/loader";
import { auth } from "@/lib/providers/google/auth";
import { createAppRouter } from "../app";
import pkg from "../package.json" with { type: "json" };

// 1. Initialize authentication credentials
await auth();

// 2. Dynamically discover and load active plugins from package.json
await loadPlugins();

// 3. Compile the tRPC router from registered plugins
const router = createAppRouter();

// 4. Run the CLI
const cli = createCli({
	router,
	name: Object.keys(pkg.bin)[0],
	version: pkg.version,
	description: pkg.description,
});

const jsonData = cli.toJSON();

function renderInfo(command: CommandJSON, level: number, meta?: any) {
  return `${"".padStart(level, "#")} ${command.name}

${meta?.description ?? command.description}`
}

function renderAliases(command: CommandJSON, level: number, meta?: any) {
  if (!meta?.aliases?.command) {
    return null;
  }
  return `##### Aliases

${meta.aliases.command.map((c: string) => `\`${c}\``).join(",")}`
}

function renderInstallation(command: CommandJSON, commandPath?: string[]) {
  const mustInstall = commandPath && commandPath.length === 2 && command.name !== "plugin" && command.name !== "cache";

  if (!mustInstall) {
    return;
  }

  return `##### Installation

\`\`\`sh
athena plugin add ${command.name}
\`\`\` 
`;
}

function renderUsage(command: CommandJSON, commandPath?: string[]) {

  const hasSubCommands = command.commands && command.commands.length > 0;

  if (hasSubCommands) {
    return;
  }

  return `##### Usage

\`\`\`sh
${commandPath?.join(" ")} ${command.usage}
\`\`\``;
}

function renderArgs(command: CommandJSON) {

  const hasArguments = command.arguments && command.arguments.length > 0;

  if (!hasArguments) {
    return;
  }

  return `##### Arguments

| | |
|-|-|
${command.arguments?.map(arg => `|\`${arg.name}\`|${arg.description}|`)}`;
}

function renderExamples(meta?: any) {
  if (!meta?.examples) {
    return;
  }

  return `##### Examples

\`\`\`sh
${meta.examples.join("\n")}
\`\`\``;
}

function renderChildren(command: CommandJSON, level: number, commandPath?: string[]) {
  return `${(command.commands ?? []).map((c) => renderCommand(c, level, commandPath)).join("\n\n")}`

}

function renderCommand(command: CommandJSON, level = 0, parentPath?: string[]): string {
  const commandLevel = level + 1;
  const commandPath = parentPath ? [...parentPath, command.name as string] : [command.name as string];
  const metaKey = commandPath.join(".");
  const meta = commandLevel === 1 ? pkg : (commandPath && metaKey in router._def.procedures ?
    router._def.procedures[metaKey].meta : null);
    
  const sections = [
    renderInfo(command, commandLevel, meta),
    renderAliases(command, commandLevel, meta),
    renderInstallation(command, commandPath),
    renderUsage(command, commandPath),
    renderArgs(command),
    renderExamples(meta),
    renderChildren(command, commandLevel, commandPath),
  ].filter(Boolean);

  return sections.join("\n\n");
}

function renderDocs() {
	README += renderCommand(jsonData, 0);
}

let README = ``;

renderDocs();

await writeFile("README.md", README, "utf-8");
