#!/usr/bin/env bun
import { dispose } from "@logtape/logtape";

import "@/lib/utils/workspace";
import { createCli } from "trpc-cli";
import { loadPlugins } from "@/lib/plugins/loader";
import { auth } from "@/lib/providers/google/auth";
import { createAppRouter } from "./app";

import pkg from "./package.json" with { type: "json" };

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

class ProcessExit extends Error {
  constructor(public code: number) {
    super(`Process exited with code ${code}`);
  }
}

let exitCode = 0;

try {
  await cli.run({
    process: {
      ...process,
      exit(code?: number): never {
        exitCode = code ?? 0;
        throw new ProcessExit(exitCode);
      },
    },
  });
} catch (err) {
  if (!(err instanceof ProcessExit)) {
    throw err;
  }
} finally {
  await dispose();
}

process.exit(exitCode);