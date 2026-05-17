#!/usr/bin/env bun

import "@/lib/utils/workspace";
import { createCli } from "trpc-cli";
import { loadPlugins } from "@/lib/plugins/loader";
import { auth } from "@/lib/providers/google/auth";
import { createAppRouter } from "./app";

// 1. Initialize authentication credentials
await auth();

// 2. Dynamically discover and load active plugins from package.json
await loadPlugins();

// 3. Compile the tRPC router from registered plugins
const app = createAppRouter();

// 4. Run the CLI
const cli = createCli({ router: app });
cli.run();
