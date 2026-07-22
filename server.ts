#!/usr/bin/env bun

import "@/lib/utils/workspace";

import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';

import { loadPlugins } from "@/lib/plugins/loader";
import { auth } from "@/lib/providers/google/auth";
import { createAppRouter } from "./app";

const PORT = process.env.PORT ?? 3000;


// 1. Initialize authentication credentials
await auth();

// 2. Dynamically discover and load active plugins from package.json
await loadPlugins();

// 3. Compile the tRPC router from registered plugins
const router = createAppRouter();


const server = createHTTPServer({
  basePath: '/trpc/',
  middleware: cors(),
  router,
});
 
server.listen(PORT);

console.log(`server listening on port: ${PORT}`)