import fs from "node:fs";
import path from "node:path";

/**
 * Robustly resolves the host project root directory (where package.json resides),
 * especially when running inside a compiled standalone Bun executable.
 */
export function findProjectRoot(): string {
  // Fallback 0: Explicit environment variable override
  if (process.env.ATHENA_PROJECT_DIR) {
    if (fs.existsSync(path.join(process.env.ATHENA_PROJECT_DIR, "package.json"))) {
      return process.env.ATHENA_PROJECT_DIR;
    }
  }

  // Fallback 1: Check relative to import.meta.dir (if it's not a virtual $bunfs path)
  const metaDir = import.meta.dir;
  if (metaDir && !metaDir.startsWith("/$bunfs")) {
    const root = path.join(metaDir, "../..");
    if (fs.existsSync(path.join(root, "package.json"))) {
      return root;
    }
  }

  // Fallback 2: Check relative to the running executable path (resolving symlinks)
  let execPath = process.execPath;
  if (execPath) {
    try {
      execPath = fs.realpathSync(execPath);
    } catch {}
    const execDir = path.dirname(execPath);
    // If running from dist/cli, parent directory is project root
    const root = path.join(execDir, "..");
    if (fs.existsSync(path.join(root, "package.json"))) {
      return root;
    }
    // Also check current exec dir
    if (fs.existsSync(path.join(execDir, "package.json"))) {
      return execDir;
    }
  }

  // Fallback 3: Check current working directory
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, "package.json"))) {
    return cwd;
  }

  // Final fallback: Use import.meta.dir's assumed parent as a last resort
  return path.join(import.meta.dir || "", "../..");
}

/**
 * Automatically loads the .env file from the resolved project root
 * and populates process.env. This is critical when executing the compiled
 * CLI binary from outside the project directory.
 */
export function loadEnv() {
  try {
    const rootDir = findProjectRoot();
    const envPath = path.join(rootDir, ".env");
    
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        // Skip comments and empty lines
        if (!trimmed || trimmed.startsWith("#")) continue;
        
        const index = trimmed.indexOf("=");
        if (index > 0) {
          const key = trimmed.slice(0, index).trim();
          let val = trimmed.slice(index + 1).trim();
          
          // Remove wrapping quotes if present
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }

          // TODO: Remove these overrides
          // If these keys are defined on the env, they take preference
          const PREFERRED_KEYS = [
            "MDBASE_COLLECTION_ROOT",
            "WEBHOOK_URL",
          ]

          if (PREFERRED_KEYS.includes(key)) {
            process.env[key] = process.env[key] ?? val;
          } else {
            // Populate env if not already set, or override defaults
            process.env[key] = val;
          }
          
        }
      }
    }
  } catch (error) {
    console.warn(`[Env] Failed to load .env:`, error);
  }
}

// Automatically load environment variables when this module is imported
loadEnv();
