#!/usr/bin/env bun

import { createCli } from 'trpc-cli';

import { auth } from '@/lib/providers/google/auth';

import app from './app';

await auth();

const cli = createCli({ router: app });
cli.run();